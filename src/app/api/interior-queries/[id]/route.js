import connectDB from '@/lib/config/db';
import { verifyAdminToken } from '@/lib/auth-utils';
import InteriorQuery from '@/lib/models/InteriorQuery';

export async function PUT(req, { params }) {
  try {
    const authResult = await verifyAdminToken(req);
    if (!authResult.valid) {
      return Response.json({ success: false, message: authResult.error }, { status: authResult.status });
    }
    
    await connectDB();
    const { id } = await params;
    const { status } = await req.json();
    const query = await InteriorQuery.findByIdAndUpdate(id, { status }, { new: true });
    if (!query) {
      return Response.json({ success: false, message: 'Interior query not found' }, { status: 404 });
    }
    return Response.json({ success: true, message: 'Status updated successfully', data: query });
  } catch (error) {
    console.error('Error updating interior query status:', error);
    return Response.json({ success: false, message: 'Error updating status', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const authResult = await verifyAdminToken(req);
    if (!authResult.valid) {
      return Response.json({ success: false, message: authResult.error }, { status: authResult.status });
    }
    
    await connectDB();
    const { id } = await params;
    const query = await InteriorQuery.findByIdAndDelete(id);
    if (!query) {
      return Response.json({ success: false, message: 'Interior query not found' }, { status: 404 });
    }
    return Response.json({ success: true, message: 'Interior query deleted successfully' });
  } catch (error) {
    console.error('Error deleting interior query:', error);
    return Response.json({ success: false, message: 'Error deleting interior query', error: error.message }, { status: 500 });
  }
}
