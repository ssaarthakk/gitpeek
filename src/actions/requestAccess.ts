'use server'

import prisma from "@/lib/prisma";

export async function submitAccessRequest(formData: FormData) {
  const shareId = formData.get('shareId') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  if (!email || !email.includes('@')) {
    return { error: 'Please provide a valid email address.' };
  }

  try {
    await prisma.accessRequest.create({
      data: {
        shareLinkId: shareId,
        viewerEmail: email,
        message: message || null,
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to submit request:", error);
    return { error: 'Something went wrong. Please try again.' };
  }
}