import connectDB from '@/lib/config/db';
import { verifyAdminToken } from '@/lib/auth-utils';
import Project from '@/lib/models/Project';
import { cloudinary } from '@/lib/config/cloudinary';

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    let query = {};
    if (type) {
        query.$or = [{ type }, { category: type }];
    }
    if (status) query.status = status;
    const projects = await Project.find(query).sort({ createdAt: -1 });
    return Response.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return Response.json({ message: 'Error fetching projects' }, { status: 500 });
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
    const projectData = {};
    for (const [key, value] of formData.entries()) {
      if (key !== 'images') {
        projectData[key] = value;
      }
    }
    
    if (projectData.highlights && typeof projectData.highlights === 'string') {
        projectData.highlights = projectData.highlights.split(',').map(h => h.trim());
    }
    if (projectData.amenities && typeof projectData.amenities === 'string') {
        projectData.amenities = projectData.amenities.split(',').map(a => a.trim());
    }

    const images = [];
    const imageFiles = formData.getAll('images');
    if (imageFiles && imageFiles.length > 0) {
        for (const file of imageFiles) {
            if (file instanceof File) {
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const result = await cloudinary.uploader.upload(`data:${file.type};base64,${buffer.toString('base64')}`, { folder: 'projects' });
                images.push(result.secure_url);
            }
        }
    }
    projectData.images = images;
    
    const project = new Project(projectData);
    await project.save();
    return Response.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return Response.json({ message: 'Error creating project' }, { status: 500 });
  }
}
