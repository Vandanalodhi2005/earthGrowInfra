import connectDB from '@/lib/config/db';
import Admin from '@/lib/models/Admin';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    await connectDB();
    const { username, password } = await req.json();

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return Response.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = await admin.matchPassword(password);
    if (!isPasswordValid) {
      return Response.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: 'admin' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    return Response.json({
      message: 'Login successful',
      token,
      user: { username: admin.username, role: 'admin' }
    });
  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
