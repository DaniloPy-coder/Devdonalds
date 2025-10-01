import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/lib/prisma";

export async function POST(req: Request) {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error("Missing Stripe secret key");
    }
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2025-08-27.basil",
    })

    const signature = req.headers.get("stripe-signature");
    if (!signature) {
        console.error(" Missing Stripe signature header");
        return NextResponse.error();
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY;
    if (!webhookSecret) {
        throw new Error("Missing Stripe webhook secret key");
    }

    const text = await req.text();

    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(text, signature, webhookSecret);
        console.log(" EVENT RECEIVED:", event.type);
    } catch (err) {
        console.error(" Webhook signature verification failed:", err);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            console.log(" Session metadata:", session.metadata);

            const orderId = session.metadata?.orderId;
            if (!orderId) {
                console.error(" No orderId in metadata");
                return NextResponse.json({ received: true });
            }

            const order = await db.order.update({
                where: { id: Number(orderId) },
                data: { status: "PAYMENT_CONFIRMED" },
                include: {
                    restaurant: { select: { slug: true } },
                },
            });

            console.log(" Order updated:", order.id, order.status);

            revalidatePath("/orders");
            revalidatePath(`/${order.restaurant.slug}/menu`);
            break;
        }

        case "charge.failed": {
            const charge = event.data.object as Stripe.Charge;
            console.log("Charge failed metadata:", charge.metadata);

            const orderId = charge.metadata?.orderId;
            if (!orderId) {
                console.error(" No orderId in metadata");
                return NextResponse.json({ received: true });
            }

            const order = await db.order.update({
                where: { id: Number(orderId) },
                data: { status: "PAYMENT_FAILED" },
                include: {
                    restaurant: { select: { slug: true } },
                },
            });

            console.log(" Order updated:", order.id, order.status);

            revalidatePath("/orders");
            revalidatePath(`/${order.restaurant.slug}/menu`);
            break;
        }
    }

    return NextResponse.json({ received: true });
}
