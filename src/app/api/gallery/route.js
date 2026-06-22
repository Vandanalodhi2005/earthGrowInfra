import connectDB from '@/lib/config/db';
import { verifyAdminToken } from '@/lib/auth-utils';
import Gallery from '@/lib/models/Gallery';
import { cloudinary } from '@/lib/config/cloudinary';

export async function GET(req) {
  try {
    await connectDB();
    const images = await Gallery.find().sort({ createdAt: -1 });
    return Response.json(images);
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
    let imageUrl = formData.get('imageUrl');
    const title = formData.get('title') || 'Exquisite Space';
    const category = formData.get('category') || 'General';
    
    const file = formData.get('image');
    if (file && file instanceof File) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const result = await cloudinary.uploader.upload(`data:${file.type};base64,${buffer.toString('base64')}`, { folder: 'gallery' });
      imageUrl = result.secure_url;
    }
    
    if (!imageUrl) {
      return Response.json({ message: 'Image is required' }, { status: 400 });
    }

    const galleryItem = new Gallery({ imageUrl, title, category });
    const newImage = await galleryItem.save();
    return Response.json(newImage, { status: 201 });
  } catch (error) {
    console.error('Gallery upload error:', error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}
