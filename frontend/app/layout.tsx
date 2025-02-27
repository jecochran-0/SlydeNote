"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const inter = Inter({ subsets: ["latin"] });
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <Elements stripe={stripePromise}>{children}</Elements>
      </body>
    </html>
  );
}
