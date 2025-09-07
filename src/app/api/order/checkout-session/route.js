import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { serverLog } from '@/utils/serverLog';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { type, jobId, sku, material, color, grams, cost, items, total, email } = body;

    if (!email || (type === 'quote' && (!jobId || !cost)) || (type === 'cart' && (!items || !total))) {
      serverLog('Stripe session creation failed: Missing fields', {
        route: '/api/order/checkout-session',
        type,
        email,
        jobId,
        sku,
        cost,
        itemCount: items?.length || 0,
        status: 400
      }, 'warn');
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const lineItems = type === 'quote'
      ? [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Quote Order – ${material} ${color}`,
              description: `SKU: ${sku}, Est. Weight: ${grams}g`,
            },
            unit_amount: Math.round(parseFloat(cost) * 100),
          },
          quantity: 1
        }]
      : items.map(item => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${item.material} – ${item.color}`,
              description: `SKU: ${item.sku}`,
              images: item.image ? [item.image] : []
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity
        }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/thank-you`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?cancelled=true`,
      metadata: {
        source: type,
        jobId: jobId || '',
        sku: sku || '',
        email
      }
    });

    serverLog('Stripe checkout session created', {
      route: '/api/order/checkout-session',
      type,
      email,
      jobId,
      itemCount: lineItems.length,
      sessionId: session.id
    }, 'audit');

    return NextResponse.json({ success: true, url: session.url });
  } catch (err) {
    serverLog('Stripe session error', {
      route: '/api/order/checkout-session',
      error: err.message
    }, 'error');

    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}