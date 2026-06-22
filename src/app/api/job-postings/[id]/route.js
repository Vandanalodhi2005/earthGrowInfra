import connectDB from '@/lib/config/db';
import { verifyAdminToken } from '@/lib/auth-utils';
import JobPosting from '@/lib/models/JobPosting';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const jobPosting = await JobPosting.findById(id);
    if (!jobPosting) {
      return Response.json({ success: false, message: 'Job posting not found' }, { status: 404 });
    }
    return Response.json({ success: true, data: jobPosting });
  } catch (error) {
    console.error('Error fetching job posting:', error);
    return Response.json({ success: false, message: 'Error fetching job posting', error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const authResult = await verifyAdminToken(req);
    if (!authResult.valid) {
      return Response.json({ success: false, message: authResult.error }, { status: authResult.status });
    }
    
    await connectDB();
    const { id } = await params;
    const { title, experience, location, jobTiming, numberOfOpenings, description, requirements, salary, status } = await req.json();
    const jobPosting = await JobPosting.findByIdAndUpdate(id, { title, experience, location, jobTiming, numberOfOpenings, description, requirements, salary, status }, { new: true, runValidators: true });
    if (!jobPosting) {
      return Response.json({ success: false, message: 'Job posting not found' }, { status: 404 });
    }
    return Response.json({ success: true, message: 'Job posting updated successfully', data: jobPosting });
  } catch (error) {
    console.error('Error updating job posting:', error);
    return Response.json({ success: false, message: 'Error updating job posting', error: error.message }, { status: 500 });
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
    const jobPosting = await JobPosting.findByIdAndDelete(id);
    if (!jobPosting) {
      return Response.json({ success: false, message: 'Job posting not found' }, { status: 404 });
    }
    return Response.json({ success: true, message: 'Job posting deleted successfully' });
  } catch (error) {
    console.error('Error deleting job posting:', error);
    return Response.json({ success: false, message: 'Error deleting job posting', error: error.message }, { status: 500 });
  }
}
