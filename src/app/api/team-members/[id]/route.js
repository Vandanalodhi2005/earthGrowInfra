import connectDB from '@/lib/config/db';
import { verifyAdminToken } from '@/lib/auth-utils';
import TeamMember from '@/lib/models/TeamMember';
import { cloudinary } from '@/lib/config/cloudinary';

export async function PUT(req, { params }) {
  try {
    const authResult = await verifyAdminToken(req);
    if (!authResult.valid) {
      return Response.json({ message: authResult.error }, { status: authResult.status });
    }
    
    await connectDB();
    const { id } = await params;
    const formData = await req.formData();
    const member = await TeamMember.findById(id);
    if (!member) return Response.json({ message: 'Member not found' }, { status: 404 });
    
    const name = formData.get('name');
    const role = formData.get('role');
    const bio = formData.get('bio');
    const order = formData.get('order');
    if (name) member.name = name;
    if (role) member.role = role;
    if (bio) member.bio = bio;
    if (order !== undefined) member.order = order;
    
    const file = formData.get('image');
    if (file && file instanceof File) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const result = await cloudinary.uploader.upload(`data:${file.type};base64,${buffer.toString('base64')}`, { folder: 'team' });
      member.image = result.secure_url;
    } else if (formData.get('image')) {
      member.image = formData.get('image');
    }
    
    const updatedMember = await member.save();
    return Response.json(updatedMember);
  } catch (error) {
    return Response.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const authResult = await verifyAdminToken(req);
    if (!authResult.valid) {
      return Response.json({ message: authResult.error }, { status: authResult.status });
    }
    
    await connectDB();
    const { id } = await params;
    const member = await TeamMember.findByIdAndDelete(id);
    if (!member) return Response.json({ message: 'Member not found' }, { status: 404 });
    return Response.json({ message: 'Member deleted successfully' });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
