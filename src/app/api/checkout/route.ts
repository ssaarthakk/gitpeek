import { auth } from "@/auth";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {

    const session = await auth();
    if (!session?.user?.id) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { quantity } = await request.json();
    if (!quantity || typeof quantity !== 'number' || quantity < 1) {
        return new NextResponse(JSON.stringify({ error: "Invalid quantity" }), { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

    try {

        const sessionOptions: Stripe.Checkout.SessionCreateParams = {
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price: process.env.STRIPE_PRICE_ID!,
                    quantity: quantity,
                    // adjustable_quantity: {
                    //     enabled: false,
                    //     minimum: 1,
                    //     maximum: 100,
                    // },
                },
            ],
            // This metadata is CRITICAL for our webhook later
            // We pass the ID of the user who is making the purchase
            metadata: {
                userId: session.user.id,
                creditsToPurchase: quantity,
            },
            success_url: `${appUrl}/dashboard/billing?success=true`,
            cancel_url: `${appUrl}/dashboard/billing?canceled=true`,
        };

        if (quantity >= 10) {
            sessionOptions.discounts = [{
                coupon: process.env.STRIPE_DISCOUNT_COUPON_ID!,
            }];
        }

        const checkoutSession = await stripe.checkout.sessions.create(sessionOptions);

        return new NextResponse(JSON.stringify({ url: checkoutSession.url }), { status: 200 });

    } catch (error) {
        console.error("Error creating Stripe checkout session:", error);
        return new NextResponse(JSON.stringify({ error: "Error creating checkout session" }), { status: 500 });
    }
}