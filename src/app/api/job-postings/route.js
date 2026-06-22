import connectDB from '@/lib/config/db';
import { verifyAdminToken } from '@/lib/auth-utils';
import JobPosting from '@/lib/models/JobPosting';

export async function GET(req) {
  try {
    const authResult = await verifyAdminToken(req);
    if (!authResult.valid) {
      return Response.json({ success: false, message: authResult.error }, { status: authResult.status });
    }
    
    await connectDB();
    const jobPostings = await JobPosting.find().sort({ createdAt: -1 });
    return Response.json({ success: true, data: jobPostings, total: jobPostings.length });
  } catch (error) {
    console.error('Error fetching job postings:', error);
    return Response.json({ success: false, message: 'Error fetching job postings', error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const authResult = await verifyAdminToken(req);
    if (!authResult.valid) {
      return Response.json({ success: false, message: authResult.error }, { status: authResult.status });
    }
    
    await connectDB();
    const { title, experience, location, jobTiming, numberOfOpenings, description, requirements, salary, status } = await req.json();
    
    if (!title || !experience || !location || !jobTiming || !numberOfOpenings || !description) {
      return Response.json({
        success: false,
        message: 'Please provide all required fields',
      }, { status: 400 });
    }
    
    const jobPosting = new JobPosting({ title, experience, location, jobTiming, numberOfOpenings, description, requirements, salary, status: status || 'active' });
    await jobPosting.save();
    return Response.json({ success: true, message: 'Job posting created successfully', data: jobPosting }, { status: 201 });
  } catch (error) {
    console.error('Error creating job posting:', error);
    return Response.json({ success: false, message: 'Error creating job posting', error: error.message }, { status: 500 });
  }
}
