import connectDB from '@/lib/config/db';
import { verifyAdminToken } from '@/lib/auth-utils';
import Property from '@/lib/models/Property';
import Contact from '@/lib/models/Contact';
import Investment from '@/lib/models/Investment';
import Project from '@/lib/models/Project';
import SubmittedProperty from '@/lib/models/SubmittedProperty';
import Gallery from '@/lib/models/Gallery';

export async function GET(req) {
  try {
    const authResult = await verifyAdminToken(req);
    if (!authResult.valid) {
      return Response.json({ message: authResult.error }, { status: authResult.status });
    }

    await connectDB();

    const totalProperties = await Property.countDocuments();
    const availableProperties = await Property.countDocuments({ status: 'available' });
    const totalContacts = await Contact.countDocuments();
    const unreadContacts = await Contact.countDocuments({ status: 'unread' });
    const totalInvestments = await Investment.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalSubmissions = await SubmittedProperty.countDocuments();
    const pendingSubmissions = await SubmittedProperty.countDocuments({ status: 'pending' });
    const totalGallery = await Gallery.countDocuments();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentProperties = await Property.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    const projectsByType = {
      residential: await Project.countDocuments({ $or: [{ type: 'residential' }, { category: 'residential' }] }),
      commercial: await Project.countDocuments({ $or: [{ type: 'commercial' }, { category: 'commercial' }] }),
      investment: await Project.countDocuments({ $or: [{ type: 'investment' }, { category: 'investment' }] }),
      mixed: await Project.countDocuments({ $or: [{ type: 'mixed' }, { category: 'mixed' }] }),
      plot: await Project.countDocuments({ $or: [{ type: 'plot & land' }, { category: 'plot & land' }] }),
      resale: await Project.countDocuments({ $or: [{ type: 'resale' }, { category: 'resale' }] }),
      interior: await Project.countDocuments({ $or: [{ type: 'interior' }, { category: 'interior' }] })
    };

    return Response.json({
      message: 'Welcome to admin dashboard',
      data: {
        totalProperties,
        availableProperties,
        totalContacts,
        unreadContacts,
        recentProperties,
        totalInvestments,
        totalProjects,
        projectsByType,
        totalSubmissions,
        pendingSubmissions,
        totalGallery,
        revenue: 0
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return Response.json({ message: 'Error fetching dashboard data' }, { status: 500 });
  }
}
