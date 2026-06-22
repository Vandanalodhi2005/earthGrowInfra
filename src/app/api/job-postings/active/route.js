import connectDB from '@/lib/config/db';
import JobPosting from '@/lib/models/JobPosting';

export async function GET(req) {
  try {
    await connectDB();
    const jobPostings = await JobPosting.find({ status: 'active' }).sort({ createdAt: -1 });
    return Response.json({ success: true, data: jobPostings, total: jobPostings.length });
  } catch (error) {
    console.error('Error fetching active job postings:', error);
    return Response.json({ success: false, message: 'Error fetching active job postings', error: error.message }, { status: 500 });
  }
}
