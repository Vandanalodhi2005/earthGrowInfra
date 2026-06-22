import connectDB from '@/lib/config/db';
import { verifyAdminToken } from '@/lib/auth-utils';
import TeamMember from '@/lib/models/TeamMember';
import { cloudinary } from '@/lib/config/cloudinary';

export async function GET(req) {
  try {
    await connectDB();
    const teamMembers = await TeamMember.find().sort({ order: 1, createdAt: -1 });
    return Response.json(teamMembers);
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const authResult = await verifyAdminToken(req);
    if (!authResult.valid) {
      return Response.json({ message: authResult.error }, { status: authResult.status });
    }
    
    await connectDB();
    const formData = await req.formData();
    const name = formData.get('name');
    const role = formData.get('role');
    const bio = formData.get('bio');
    const order = formData.get('order') || 0;
    let imageUrl = '';
    
    const file = formData.get('image');
    if (file && file instanceof File) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const result = await cloudinary.uploader.upload(`data:${file.type};base64,${buffer.toString('base64')}`, { folder: 'team' });
      imageUrl = result.secure_url;
    } else if (formData.get('image')) {
      imageUrl = formData.get('image');
    }
    
    if (!imageUrl) {
      return Response.json({ message: 'Image is required' }, { status: 400 });
    }
    
    const teamMember = new TeamMember({ name, role, bio, image: imageUrl, order });
    const newMember = await teamMember.save();
    return Response.json(newMember, { status: 201 });
  } catch (error) {
    console.error('Error creating team member:', error);
    return Response.json({ message: error.message }, { status: 400 });
  }
}
