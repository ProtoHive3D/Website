// File: src/app/api/email/quote-confirmation/route.js
// Last updated: 2025-09-02 21:39 CDT

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req) {
  const { email, jobId, material, color, grams, cost } = await req.json();

  if (!email || !jobId) {
    return NextResponse.json({ success: false, error: 'Missing email or jobId' }, { status: 400 });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'quotes@protohive3d.com',
      to: email,
      subject: `Your ProtoHive3D Quote Confirmation: ${jobId}`,
      html: `
        <h2>Thank you for your quote submission!</h2>
        <p><strong>Job ID:</strong> ${jobId}</p>
        <p><strong>Material:</strong> ${material}</p>
        <p><strong>Color:</strong> ${color}</p>
        <p><strong>Grams:</strong> ${grams}</p>
        <p><strong>Cost:</strong> $${cost}</p>
        <p>You can track your quote status anytime using your Job ID.</p>
        <p>— ProtoHive3D Team</p>
      `
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}