import connectDB from '@/lib/config/db';
import { verifyAdminToken } from '@/lib/auth-utils';
import Admin from '@/lib/models/Admin';

export async function PUT(req) {
  try {
    const authResult = await verifyAdminToken(req);
    if (!authResult.valid) {
      return Response.json({ message: authResult.error }, { status: authResult.status });
    }

    await connectDB();
    const { newUsername, newPassword } = await req.json();
    const adminId = authResult.admin.id;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return Response.json({ message: 'Admin not found' }, { status: 404 });
    }

    if (newUsername) {
      admin.username = newUsername;
    }

    if (newPassword) {
      admin.password = newPassword;
    }

    await admin.save();

    return Response.json({
      message: 'Settings updated successfully',
      user: { username: admin.username, role: 'admin' }
    });
  } catch (error) {
    console.error('Update settings error:', error);
    return Response.json({ message: 'Error updating settings' }, { status: 500 });
  }
}
