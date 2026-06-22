import connectDB from '@/lib/config/db';
import { verifyAdminToken } from '@/lib/auth-utils';
import Property from '@/lib/models/Property';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const property = await Property.findById(id);
    if (!property) {
      return Response.json({ message: 'Property not found' }, { status: 404 });
    }
    return Response.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    return Response.json({ message: 'Error fetching property' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const authResult = await verifyAdminToken(req);
    if (!authResult.valid) {
      return Response.json({ message: authResult.error }, { status: authResult.status });
    }

    await connectDB();
    const { id } = await params;
    const propertyData = await req.json();

    if (propertyData.amenities && typeof propertyData.amenities === 'string') {
      propertyData.amenities = propertyData.amenities.split(',').map(a => a.trim());
    }

    const property = await Property.findByIdAndUpdate(
      id,
      propertyData,
      { new: true, runValidators: true }
    );

    if (!property) {
      return Response.json({ message: 'Property not found' }, { status: 404 });
    }
    return Response.json(property);
  } catch (error) {
    console.error('Error updating property:', error);
    return Response.json({ message: 'Error updating property' }, { status: 500 });
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
    const property = await Property.findByIdAndDelete(id);
    if (!property) {
      return Response.json({ message: 'Property not found' }, { status: 404 });
    }
    return Response.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    return Response.json({ message: 'Error deleting property' }, { status: 500 });
  }
}
