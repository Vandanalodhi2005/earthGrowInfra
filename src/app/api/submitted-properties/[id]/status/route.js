import connectDB from '@/lib/config/db';
import { verifyAdminToken } from '@/lib/auth-utils';
import SubmittedProperty from '@/lib/models/SubmittedProperty';

export async function PUT(req, { params }) {
  try {
    const authResult = await verifyAdminToken(req);
    if (!authResult.valid) {
      return Response.json({ message: authResult.error }, { status: authResult.status });
    }
    
    await connectDB();
    const { id } = await params;
    const { status } = await req.json();
    const submission = await SubmittedProperty.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
    if (!submission) {
      return Response.json({ message: 'Submission not found' }, { status: 404 });
    }
    return Response.json(submission);
  } catch (error) {
    console.error('Error updating submission status:', error);
    return Response.json({ message: 'Error updating submission status' }, { status: 500 });
  }
}
