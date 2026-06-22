import connectDB from '@/lib/config/db';
import { verifyAdminToken } from '@/lib/auth-utils';
import InteriorQuery from '@/lib/models/InteriorQuery';
import { sendEmail } from '@/lib/utils/emailService';

export async function GET(req) {
  try {
    const authResult = await verifyAdminToken(req);
    if (!authResult.valid) {
      return Response.json({ success: false, message: authResult.error }, { status: authResult.status });
    }
    
    await connectDB();
    const queries = await InteriorQuery.find().sort({ createdAt: -1 });
    return Response.json({ success: true, data: queries, total: queries.length });
  } catch (error) {
    console.error('Error fetching interior queries:', error);
    return Response.json({ success: false, message: 'Error fetching interior queries', error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { fullName, email, phone, serviceType, message } = await req.json();
    if (!fullName || !email || !phone || !serviceType) {
      return Response.json({
        success: false,
        message: 'Please provide all required fields: fullName, email, phone, and serviceType',
      }, { status: 400 });
    }
    const interiorQuery = new InteriorQuery({ fullName, email, phone, serviceType, message: message || '' });
    await interiorQuery.save();

    const adminEmailContent = `
      <h2>New Interior Design Query</h2>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Service Type:</strong> ${serviceType}</p>
      <p><strong>Message:</strong> ${message || 'No message provided'}</p>
      <p><strong>Received at:</strong> ${new Date().toLocaleString()}</p>
    `;

    const customerEmailContent = `
      <h2>Thank You for Your Interior Design Query</h2>
      <p>Dear ${fullName},</p>
      <p>We have received your query for ${serviceType} interior design services. Our team will contact you shortly at ${phone}.</p>
      <p>Thank you for choosing us!</p>
      <p>Best regards,<br/>The Earth Grow Infra Team</p>
    `;

    const adminEmail = process.env.ADMIN_EMAIL || 'viodhi152@gmail.com';
    await sendEmail(adminEmail, 'New Interior Query', adminEmailContent);
    await sendEmail(email, 'Interior Design Query Confirmation', customerEmailContent);

    return Response.json({
      success: true,
      message: 'Interior query submitted successfully',
      data: interiorQuery,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating interior query:', error);
    return Response.json({
      success: false,
      message: 'Error submitting interior query',
      error: error.message,
    }, { status: 500 });
  }
}
