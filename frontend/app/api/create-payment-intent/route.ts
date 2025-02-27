import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Verify environment variable exists
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20" as Stripe.LatestApiVersion, // Use stable version
});

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json();

    if (!amount || typeof amount !== "number") {
      return NextResponse.json(
        { error: "Amount is required and must be a number" },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Stripe payment intent error:", error.message);
      return NextResponse.json(
        {
          error: "Failed to create payment intent: " + (error as Error).message,
        },
        { status: 500 }
      );
    } else {
      console.error("Stripe payment intent error:", error);
      return NextResponse.json(
        { error: "Failed to create payment intent" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create payment intent: " + (error as Error).message },
      { status: 500 }
    );
  }
}
