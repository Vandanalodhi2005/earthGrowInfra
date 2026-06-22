import connectDB from '@/lib/config/db';
import { verifyAdminToken } from '@/lib/auth-utils';
import Contact from '@/lib/models/Contact';

export async function PUT(req, { params }) {
  try {
    const authResult = await verifyAdminToken(req);
    if (!authResult.valid) {
      return Response.json({ message: authResult.error }, { status: authResult.status });
    }

    await connectDB();
    const { id } = await params;
    const { status } = await req.json();
    
    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    if (!contact) {
      return Response.json({ message: 'Contact not found' }, { status: 404 });
    }
    return Response.json(contact);
  } catch (error) {
    console.error('Error updating contact status:', error);
    return Response.json({ message: 'Error updating contact status' }, { status: 500 });
  }
}
