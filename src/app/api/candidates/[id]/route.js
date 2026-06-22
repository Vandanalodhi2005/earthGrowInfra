import connectDB from '@/lib/config/db';
import { verifyAdminToken } from '@/lib/auth-utils';
import CandidateInquiry from '@/lib/models/CandidateInquiry';

export async function PUT(req, { params }) {
  try {
    const authResult = await verifyAdminToken(req);
    if (!authResult.valid) {
      return Response.json({ success: false, message: authResult.error }, { status: authResult.status });
    }
    
    await connectDB();
    const { id } = await params;
    const { status } = await req.json();
    const application = await CandidateInquiry.findByIdAndUpdate(id, { status }, { new: true });
    if (!application) {
      return Response.json({ success: false, message: 'Application not found' }, { status: 404 });
    }
    return Response.json({ success: true, message: 'Application status updated successfully', data: application });
  } catch (error) {
    console.error('Error updating application:', error);
    return Response.json({ success: false, message: 'Error updating application', error: error.message }, { status: 500 });
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
    const application = await CandidateInquiry.findByIdAndDelete(id);
    if (!application) {
      return Response.json({ success: false, message: 'Application not found' }, { status: 404 });
    }
    return Response.json({ success: true, message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
    return Response.json({ success: false, message: 'Error deleting application', error: error.message }, { status: 500 });
  }
}
