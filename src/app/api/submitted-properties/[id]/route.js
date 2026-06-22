import connectDB from '@/lib/config/db';
import { verifyAdminToken } from '@/lib/auth-utils';
import SubmittedProperty from '@/lib/models/SubmittedProperty';

export async function DELETE(req, { params }) {
  try {
    const authResult = await verifyAdminToken(req);
    if (!authResult.valid) {
      return Response.json({ message: authResult.error }, { status: authResult.status });
    }
    
    await connectDB();
    const { id } = await params;
    const submission = await SubmittedProperty.findByIdAndDelete(id);
    if (!submission) {
      return Response.json({ message: 'Submission not found' }, { status: 404 });
    }
    return Response.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    console.error('Error deleting submission:', error);
    return Response.json({ message: 'Error deleting submission' }, { status: 500 });
  }
}
