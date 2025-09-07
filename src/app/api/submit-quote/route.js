// File: src/app/api/submit-quote/route.js
// Last updated: 2025-09-02 21:44 CDT

import { NextResponse } from 'next/server';
import { getDB } from '@/utils/db';
import { Resend } from 'resend';

export async function POST(req) {
  const { email, material, color, grams, cost } = await req.json();

  if (!email || !material || !color || !grams || !cost) {
    return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
  }

  const jobId = 'job_' + Math.random().toString(36).substring(2, 10).toUpperCase();
  const createdAt = new Date().toISOString();

  const db = await getDB();
  await db.run(
    'INSERT INTO quotes (job_id, email, material, color, grams, cost, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [jobId, email, material, color, grams, cost, 'submitted', createdAt]
  );

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
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Quote saved but email failed: ' + err.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, jobId });
}