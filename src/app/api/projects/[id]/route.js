import connectDB from '@/lib/config/db';
import { verifyAdminToken } from '@/lib/auth-utils';
import Project from '@/lib/models/Project';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const project = await Project.findById(id);
    if (!project) {
      return Response.json({ message: 'Project not found' }, { status: 404 });
    }
    return Response.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return Response.json({ message: 'Error fetching project' }, { status: 500 });
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
    const projectData = await req.json();
    if (projectData.highlights && typeof projectData.highlights === 'string') {
        projectData.highlights = projectData.highlights.split(',').map(h => h.trim());
    }
    if (projectData.amenities && typeof projectData.amenities === 'string') {
        projectData.amenities = projectData.amenities.split(',').map(a => a.trim());
    }
    const project = await Project.findByIdAndUpdate(id, projectData, { new: true, runValidators: true });
    if (!project) {
      return Response.json({ message: 'Project not found' }, { status: 404 });
    }
    return Response.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    return Response.json({ message: 'Error updating project' }, { status: 500 });
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
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return Response.json({ message: 'Project not found' }, { status: 404 });
    }
    return Response.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return Response.json({ message: 'Error deleting project' }, { status: 500 });
  }
}
