import { NextResponse } from 'next/server';
import { getDB } from '@/utils/db';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  const { email, password, name } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ success: false, error: 'Missing email or password' }, { status: 400 });
  }

  const db = await getDB();
  const existing = await db.get(`SELECT id FROM users WHERE email = ?`, [email]);
  if (existing) {
    return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 10);
  await db.run(
    `INSERT INTO users (email, password, name) VALUES (?, ?, ?)`,
    [email, hashed, name || null]
  );

  // Set session cookie (placeholder)
  return NextResponse.json({ success: true }, {
    headers: {
      'Set-Cookie': `user=${email}; Path=/; HttpOnly`
    }
  });
}