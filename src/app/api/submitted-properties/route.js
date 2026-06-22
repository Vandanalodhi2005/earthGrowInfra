import connectDB from '@/lib/config/db';
import { verifyAdminToken } from '@/lib/auth-utils';
import SubmittedProperty from '@/lib/models/SubmittedProperty';
import { sendEmailNotification } from '@/lib/utils/emailService';

export async function GET(req) {
  try {
    const authResult = await verifyAdminToken(req);
    if (!authResult.valid) {
      return Response.json({ message: authResult.error }, { status: authResult.status });
    }
    
    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    let query = {};
    if (status) query.status = status;
    const submissions = await SubmittedProperty.find(query).sort({ createdAt: -1 });
    return Response.json(submissions);
  } catch (error) {
    console.error('Error fetching submitted properties:', error);
    return Response.json({ message: 'Error fetching submitted properties' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const propertyData = await req.json();
    if (propertyData.features && typeof propertyData.features === 'string') {
        propertyData.features = propertyData.features.split(',').map(f => f.trim());
    }
    const submittedProperty = new SubmittedProperty(propertyData);
    await submittedProperty.save();

    const emailSubject = `New Property Submission: ${propertyData.title}`;
    const emailHtml = `
        <h3>New Property Submission for Analysis</h3>
        <p><strong>Owner Name:</strong> ${propertyData.contactName}</p>
        <p><strong>Owner Email:</strong> ${propertyData.contactEmail}</p>
        <p><strong>Owner Phone:</strong> ${propertyData.contactPhone}</p>
        <p><strong>Property Title:</strong> ${propertyData.title}</p>
        <p><strong>Category:</strong> ${propertyData.category}</p>
        <p><strong>Price Requested:</strong> ₹${propertyData.price?.toLocaleString() || 'N/A'}</p>
        <p><strong>Location:</strong> ${propertyData.location}</p>
        <p><strong>Details:</strong> ${propertyData.message || 'No description provided'}</p>
    `;
    await sendEmailNotification(emailSubject, emailHtml);

    return Response.json({ message: 'Property submitted successfully', submittedProperty }, { status: 201 });
  } catch (error) {
    console.error('Error submitting property:', error);
    return Response.json({ message: 'Error submitting property' }, { status: 500 });
  }
}
