import connectDB from '@/lib/config/db';
import { verifyAdminToken } from '@/lib/auth-utils';
import CandidateInquiry from '@/lib/models/CandidateInquiry';

export async function GET(req, { params }) {
  try {
    const authResult = await verifyAdminToken(req);
    if (!authResult.valid) {
      return Response.json({ success: false, message: authResult.error }, { status: authResult.status });
    }
    
    await connectDB();
    const { position } = await params;
    const applications = await CandidateInquiry.find({ position }).sort({ createdAt: -1 });
    return Response.json({ success: true, data: applications, total: applications.length });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return Response.json({ success: false, message: 'Error fetching applications', error: error.message }, { status: 500 });
  }
}
