import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getDB } from '@/utils/db';
import { serverLog } from '@/utils/serverLog';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const rawBody = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    serverLog('Stripe webhook signature verification failed', {
      route: '/api/order/webhook',
      error: err.message
    }, 'warn');
    return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { jobId, email, source } = session.metadata;

    try {
      const db = await getDB();
      await db.run(`
        UPDATE orders
        SET status = 'paid'
        WHERE job_id = ? AND email = ?
      `, [jobId, email]);

      serverLog('Order marked as paid', {
        route: '/api/order/webhook',
        jobId,
        email,
        source,
        sessionId: session.id
      }, 'audit');
    } catch (err) {
      serverLog('Order update failed after payment', {
        route: '/api/order/webhook',
        jobId,
        email,
        error: err.message
      }, 'error');
    }
  }

  return NextResponse.json({ received: true });
}