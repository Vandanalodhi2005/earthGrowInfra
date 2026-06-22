import connectDB from '@/lib/config/db';
import { verifyAdminToken } from '@/lib/auth-utils';
import Gallery from '@/lib/models/Gallery';

export async function DELETE(req, { params }) {
  try {
    const authResult = await verifyAdminToken(req);
    if (!authResult.valid) {
      return Response.json({ message: authResult.error }, { status: authResult.status });
    }
    
    await connectDB();
    const { id } = await params;
    const item = await Gallery.findById(id);
    if (!item) {
      return Response.json({ message: 'Image not found' }, { status: 404 });
    }
    await Gallery.findByIdAndDelete(id);
    return Response.json({ message: 'Image deleted' });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
