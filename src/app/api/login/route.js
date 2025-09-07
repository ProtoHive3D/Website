import { NextResponse } from 'next/server';
import { getDB } from '@/utils/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'protohive-secret';

export async function POST(req) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ success: false, error: 'Missing credentials' }, { status: 400 });
  }

  const db = await getDB();
  const user = await db.get(`SELECT id, email, password, name, role FROM users WHERE email = ?`, [email]);
  if (!user) {
    return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    SECRET,
    { expiresIn: '7d' }
  );

  const response = NextResponse.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });

  response.headers.set(
    'Set-Cookie',
    `session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`
  );

  return response;
}