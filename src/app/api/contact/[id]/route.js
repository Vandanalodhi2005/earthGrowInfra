import connectDB from '@/lib/config/db';
import { verifyAdminToken } from '@/lib/auth-utils';
import Contact from '@/lib/models/Contact';

export async function GET(req, { params }) {
  try {
    const authResult = await verifyAdminToken(req);
    if (!authResult.valid) {
      return Response.json({ message: authResult.error }, { status: authResult.status });
    }

    await connectDB();
    const { id } = await params;
    const contact = await Contact.findById(id);
    if (!contact) {
      return Response.json({ message: 'Contact not found' }, { status: 404 });
    }
    return Response.json(contact);
  } catch (error) {
    console.error('Error fetching contact:', error);
    return Response.json({ message: 'Error fetching contact' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const authResult = await verifyAdminToken(req);
    if (!authResult.valid) {
      return Response.json({ message: authResult.error }, { status: authResult.status });
    }

    await connectDB();
    const { id } = await params;
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return Response.json({ message: 'Contact not found' }, { status: 404 });
    }
    return Response.json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return Response.json({ message: 'Error deleting contact' }, { status: 500 });
  }
}
