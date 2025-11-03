import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

let stripe: Stripe;

export async function POST(request: Request) {
  if (!stripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return new NextResponse("Stripe secret key not set", { status: 500 });
    }
    stripe = new Stripe(secretKey);
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    // Verify the event is genuinely from Stripe
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error(`❌ Error message: ${errorMessage}`);
    return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 400 });
  }

  // Handle the 'checkout.session.completed' event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Retrieve the metadata we passed earlier
    const userId = session.metadata?.userId;
    const creditsToPurchase = Number(session.metadata?.creditsToPurchase);

    if (!userId || !creditsToPurchase) {
      return new NextResponse("Webhook Error: Missing metadata", { status: 400 });
    }

    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          credits: {
            increment: creditsToPurchase,
          },
        },
      });
    } catch (error) {
      console.error('Failed to update user credits:', error);
      return new NextResponse("Webhook Error: Failed to update user credits", { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}