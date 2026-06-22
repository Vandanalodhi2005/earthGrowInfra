import connectDB from '@/lib/config/db';
import { verifyAdminToken } from '@/lib/auth-utils';
import Investment from '@/lib/models/Investment';
import { cloudinary } from '@/lib/config/cloudinary';
import mongoose from 'mongoose';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const landType = searchParams.get('landType');
    const status = searchParams.get('status');
    const city = searchParams.get('city');
    const page = searchParams.get('page') || 1;
    const limit = searchParams.get('limit') || 10;
    
    let query = {};
    if (landType) query.landType = landType;
    if (status) query.status = status;
    if (city) query.city = new RegExp(city, 'i');
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
        
    const investments = await Investment.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
        
    const total = await Investment.countDocuments(query);
    
    return Response.json({
        data: investments,
        total,
        pages: Math.ceil(total / parseInt(limit)),
        currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error fetching investments:', error);
    return Response.json({ message: 'Error fetching investments', error: error.message }, { status: 500 });
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
    const investmentData = {};
    for (const [key, value] of formData.entries()) {
      if (key !== 'images') {
        investmentData[key] = value;
      }
    }
    
    if (investmentData.highlights && typeof investmentData.highlights === 'string') {
        investmentData.highlights = investmentData.highlights.split(',').map(h => h.trim()).filter(h => h.length > 0);
    }
    
    const images = [];
    const imageFiles = formData.getAll('images');
    if (imageFiles && imageFiles.length > 0) {
        for (const file of imageFiles) {
            if (file instanceof File) {
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const result = await cloudinary.uploader.upload(`data:${file.type};base64,${buffer.toString('base64')}`, { folder: 'investments' });
                images.push(result.secure_url);
            }
        }
    }
    investmentData.images = images;
    
    const investment = new Investment(investmentData);
    await investment.save();
    return Response.json({ message: 'Investment created successfully', data: investment }, { status: 201 });
  } catch (error) {
    console.error('Error creating investment:', error);
    if (error.name === 'ValidationError') {
        return Response.json({ message: 'Validation error', errors: Object.values(error.errors).map(e => e.message) }, { status: 400 });
    }
    return Response.json({ message: 'Error creating investment', error: error.message }, { status: 500 });
  }
}
