import connectDB from '@/lib/config/db';
import { verifyAdminToken } from '@/lib/auth-utils';
import Contact from '@/lib/models/Contact';
import { sendEmailNotification } from '@/lib/utils/emailService';

export async function GET(req) {
  try {
    const authResult = await verifyAdminToken(req);
    if (!authResult.valid) {
      return Response.json({ message: authResult.error }, { status: authResult.status });
    }

    await connectDB();
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return Response.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return Response.json({ message: 'Error fetching contacts' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, phone, message, propertyId, propertyTitle } = await req.json();

    const isPropertyInquiry = !!propertyId;
    const finalMessage = isPropertyInquiry ? 
      `Property Inquiry: ${propertyTitle}\n\n${message}` : message;

    const contactData = {
      name,
      email,
      phone,
      message: finalMessage
    };

    const contact = new Contact(contactData);
    await contact.save();

    const emailSubject = isPropertyInquiry ? `New Property Inquiry: ${propertyTitle}` : 'New General Contact Inquiry';
    const emailHtml = `
      <h3>New Inquiry from ${name}</h3>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong></p>
      <p>${finalMessage.replace(/\n/g, '<br>')}</p>
    `;

    await sendEmailNotification(emailSubject, emailHtml);

    return Response.json(
      { message: 'Message sent successfully', contact, isPropertyInquiry },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating contact:', error);
    return Response.json({ message: 'Error sending message' }, { status: 500 });
  }
}
