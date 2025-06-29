import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, username: string };
    return NextResponse.json({ message: `Welcome ${decoded.username}`,username:decoded.username }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 403 });
  }
}
