import connectDB from '@/lib/config/db';
import { verifyAdminToken } from '@/lib/auth-utils';
import Property from '@/lib/models/Property';
import { cloudinary } from '@/lib/config/cloudinary';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const city = searchParams.get('city');
    const location = searchParams.get('location');
    
    let query = {};
    if (type) query.propertyType = type;
    if (category) query.propertyType = category;
    if (status) query.status = status;
    if (city) query.city = new RegExp(city, 'i');
    if (location) query.location = new RegExp(location, 'i');
    
    const properties = await Property.find(query).sort({ createdAt: -1 });
    return Response.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return Response.json({ message: 'Error fetching properties' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const authResult = await verifyAdminToken(req);
    if (!authResult.valid) {
      return Response.json({ message: authResult.error }, { status: authResult.status });
    }

    await connectDB();
    const formData = await req.formData();
    const propertyData = {};
    for (const [key, value] of formData.entries()) {
      if (key !== 'images') {
        propertyData[key] = value;
      }
    }

    if (propertyData.amenities && typeof propertyData.amenities === 'string') {
      propertyData.amenities = propertyData.amenities.split(',').map(a => a.trim());
    }

    const images = [];
    const imageFiles = formData.getAll('images');
    if (imageFiles && imageFiles.length > 0) {
      for (const file of imageFiles) {
        if (file instanceof File) {
          try {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const result = await cloudinary.uploader.upload(
              `data:${file.type};base64,${buffer.toString('base64')}`,
              { folder: 'properties' }
            );
            images.push(result.secure_url);
          } catch (imgError) {
            console.error('Cloudinary upload error:', imgError);
            return Response.json(
              { message: 'Error uploading images to Cloudinary', error: imgError.message },
              { status: 400 }
            );
          }
        }
      }
    }
    propertyData.images = images;

    const property = new Property(propertyData);
    await property.save();
    return Response.json(property, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    if (error.name === 'ValidationError') {
      return Response.json({ message: 'Validation Error', errors: error.errors }, { status: 400 });
    }
    return Response.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
