import connectDB from '@/lib/config/db';
import { verifyAdminToken } from '@/lib/auth-utils';
import Investment from '@/lib/models/Investment';
import { cloudinary } from '@/lib/config/cloudinary';
import mongoose from 'mongoose';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({ message: 'Invalid investment ID format' }, { status: 400 });
    }
    const investment = await Investment.findById(id);
    if (!investment) {
      return Response.json({ message: 'Investment not found' }, { status: 404 });
    }
    return Response.json(investment);
  } catch (error) {
    console.error('Error fetching investment:', error);
    return Response.json({ message: 'Error fetching investment', error: error.message }, { status: 500 });
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({ message: 'Invalid investment ID format' }, { status: 400 });
    }
    
    let investmentData;
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
        const formData = await req.formData();
        investmentData = {};
        for (const [key, value] of formData.entries()) {
            if (key !== 'images') {
                investmentData[key] = value;
            }
        }
        
        const imageFiles = formData.getAll('images');
        if (imageFiles && imageFiles.length > 0) {
            const images = [];
            for (const file of imageFiles) {
                if (file instanceof File) {
                    const bytes = await file.arrayBuffer();
                    const buffer = Buffer.from(bytes);
                    const result = await cloudinary.uploader.upload(`data:${file.type};base64,${buffer.toString('base64')}`, { folder: 'investments' });
                    images.push(result.secure_url);
                }
            }
            investmentData.images = images;
        }
    } else {
        investmentData = await req.json();
    }
    
    if (investmentData.highlights && typeof investmentData.highlights === 'string') {
        investmentData.highlights = investmentData.highlights.split(',').map(h => h.trim()).filter(h => h.length > 0);
    }

    const investment = await Investment.findByIdAndUpdate(id, investmentData, { new: true, runValidators: true });
    if (!investment) {
      return Response.json({ message: 'Investment not found' }, { status: 404 });
    }
    return Response.json({ message: 'Investment updated successfully', data: investment });
  } catch (error) {
    console.error('Error updating investment:', error);
    if (error.name === 'ValidationError') {
        return Response.json({ message: 'Validation error', errors: Object.values(error.errors).map(e => e.message) }, { status: 400 });
    }
    return Response.json({ message: 'Error updating investment', error: error.message }, { status: 500 });
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({ message: 'Invalid investment ID format' }, { status: 400 });
    }
    const investment = await Investment.findByIdAndDelete(id);
    if (!investment) {
      return Response.json({ message: 'Investment not found' }, { status: 404 });
    }
    return Response.json({ message: 'Investment deleted successfully', data: investment });
  } catch (error) {
    console.error('Error deleting investment:', error);
    return Response.json({ message: 'Error deleting investment', error: error.message }, { status: 500 });
  }
}
