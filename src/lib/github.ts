import prisma from "@/lib/prisma";
import { Octokit } from "@octokit/core";
import { Account } from "@prisma/client";
import axios from "axios";

export async function getFreshAccessToken(account: Account) {
    if (!account.expires_at || !account.refresh_token) {
        return account.access_token;
    }

    const isExpired = Date.now() > (account.expires_at * 1000 - 60000);

    if (!isExpired) {
        return account.access_token;
    }

    console.log("Access token expired, refreshing...");
    try {
        const response = await axios.post(
            "https://github.com/login/oauth/access_token",
            new URLSearchParams({
                client_id: process.env.AUTH_GITHUB_ID!,
                client_secret: process.env.GITHUB_CLIENT_SECRET!,
                grant_type: "refresh_token",
                refresh_token: account.refresh_token,
            }),
            {
                headers: {
                    "Accept": "application/json",
                },
            }
        );

        const tokens = response.data;

        if (!tokens.access_token) {
            console.error("Failed to refresh access token:", tokens);
            throw new Error("Failed to refresh GitHub access token.");
        }

        const newExpiresAt = Math.floor(Date.now() / 1000) + tokens.expires_in;
        await prisma.account.update({
            where: { id: account.id },
            data: {
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token ?? account.refresh_token,
                expires_at: newExpiresAt,
            },
        });

        return tokens.access_token;
    } catch (error) {
        console.error("Failed to refresh access token:", error);
        return account.access_token;
    }
}

export async function ensureInstallation(userAccessToken: string) {
  const octokit = new Octokit({ auth: userAccessToken });
  const { data } = await octokit.request("GET /user/installations");

  const installation = data.installations.find(
    (i) => i.app_slug === process.env.GITHUB_APP_SLUG
  );

  if (!installation) {
    return {
      redirect: `https://github.com/apps/${process.env.GITHUB_APP_SLUG}/installations/new`,
    };
  }

  return { ok: true, installation };
}