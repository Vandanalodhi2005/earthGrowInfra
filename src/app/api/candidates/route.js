import connectDB from '@/lib/config/db';
import { verifyAdminToken } from '@/lib/auth-utils';
import CandidateInquiry from '@/lib/models/CandidateInquiry';
import { sendEmail } from '@/lib/utils/emailService';

export async function GET(req) {
  try {
    const authResult = await verifyAdminToken(req);
    if (!authResult.valid) {
      return Response.json({ success: false, message: authResult.error }, { status: authResult.status });
    }
    
    await connectDB();
    const applications = await CandidateInquiry.find().sort({ createdAt: -1 });
    return Response.json({ success: true, data: applications, total: applications.length });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return Response.json({ success: false, message: 'Error fetching applications', error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { fullName, email, mobile, position, experience, location, message } = await req.json();
    
    if (!fullName || !email || !mobile || !position || experience === undefined || experience === null || !location) {
      return Response.json({
        success: false,
        message: 'Please provide all required fields',
      }, { status: 400 });
    }
    
    const experienceNum = Number(experience);
    if (isNaN(experienceNum) || experienceNum < 0) {
      return Response.json({
        success: false,
        message: 'Experience must be a valid non-negative number',
      }, { status: 400 });
    }
    
    const candidate = new CandidateInquiry({ fullName, email, mobile, position, experience: experienceNum, location, message });
    await candidate.save();

    const adminEmailContent = `
      <h2>New Job Application Received</h2>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mobile:</strong> ${mobile}</p>
      <p><strong>Position:</strong> ${position}</p>
      <p><strong>Location:</strong> ${location}</p>
      <p><strong>Experience (Years):</strong> ${experienceNum}</p>
      <p><strong>Message:</strong> ${message || 'N/A'}</p>
      <p><strong>Applied at:</strong> ${new Date().toLocaleString()}</p>
    `;

    const candidateEmailContent = `
      <h2>Application Received</h2>
      <p>Dear ${fullName},</p>
      <p>Thank you for applying for the position of <strong>${position}</strong> at Earth Grow Infra.</p>
      <p>We have received your application and our HR team will review it shortly. If your profile matches our requirements, we will contact you at ${mobile}.</p>
      <p>Best regards,<br/>HR Team - Earth Grow Infra</p>
    `;

    sendEmail(process.env.ADMIN_EMAIL, 'New Job Application', adminEmailContent).catch(err => 
      console.error('Failed to send admin email:', err)
    );
    sendEmail(email, 'Application Received - Earth Grow Infra', candidateEmailContent).catch(err => 
      console.error('Failed to send candidate email:', err)
    );

    return Response.json({
      success: true,
      message: 'Application submitted successfully',
      data: candidate,
    }, { status: 201 });
  } catch (error) {
    console.error('Error submitting application:', error);
    return Response.json({
      success: false,
      message: 'Error submitting application',
      error: error.message,
    }, { status: 500 });
  }
}
