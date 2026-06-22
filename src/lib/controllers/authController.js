const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Property = require('../models/Property');
const Contact = require('../models/Contact');
const Investment = require('../models/Investment');
const Project = require('../models/Project');
const SubmittedProperty = require('../models/SubmittedProperty');
const Gallery = require('../models/Gallery');

const login = async(req, res) => {
    try {
        const { username, password } = req.body;

        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await admin.matchPassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: admin._id, username: admin.username, role: 'admin' },
            process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: { username: admin.username, role: 'admin' }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateAdminSettings = async(req, res) => {
    try {
        const { newUsername, newPassword } = req.body;
        const adminId = req.admin.id;

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        if (newUsername) {
            admin.username = newUsername;
        }

        if (newPassword) {
            admin.password = newPassword;
        }

        await admin.save();

        res.json({
            message: 'Settings updated successfully',
            user: { username: admin.username, role: 'admin' }
        });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ message: 'Error updating settings' });
    }
};

const getDashboard = async(req, res) => {
    try {
        // Get real statistics from database
        const totalProperties = await Property.countDocuments();
        const availableProperties = await Property.countDocuments({ status: 'available' });
        const totalContacts = await Contact.countDocuments();
        const unreadContacts = await Contact.countDocuments({ status: 'unread' });
        const totalInvestments = await Investment.countDocuments();
        const totalProjects = await Project.countDocuments();
        const totalSubmissions = await SubmittedProperty.countDocuments();
        const pendingSubmissions = await SubmittedProperty.countDocuments({ status: 'pending' });
        const totalGallery = await Gallery.countDocuments();

        // Get recent properties (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentProperties = await Property.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

        // Get project breakdown by type
        const projectsByType = {
            residential: await Project.countDocuments({ $or: [{ type: 'residential' }, { category: 'residential' }] }),
            commercial: await Project.countDocuments({ $or: [{ type: 'commercial' }, { category: 'commercial' }] }),
            investment: await Project.countDocuments({ $or: [{ type: 'investment' }, { category: 'investment' }] }),
            mixed: await Project.countDocuments({ $or: [{ type: 'mixed' }, { category: 'mixed' }] }),
            plot: await Project.countDocuments({ $or: [{ type: 'plot & land' }, { category: 'plot & land' }] }),
            resale: await Project.countDocuments({ $or: [{ type: 'resale' }, { category: 'resale' }] }),
            interior: await Project.countDocuments({ $or: [{ type: 'interior' }, { category: 'interior' }] })
        };

        res.json({
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
        res.status(500).json({ message: 'Error fetching dashboard data' });
    }
};

module.exports = { login, getDashboard, updateAdminSettings };