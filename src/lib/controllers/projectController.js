const Project = require('../models/Project');
const { cloudinary } = require('../config/cloudinary');

const getAllProjects = async (req, res) => {
    try {
        const { type, status } = req.query;
        let query = {};

        if (type) {
            query.$or = [{ type: type }, { category: type }];
        }
        if (status) query.status = status;

        const projects = await Project.find(query).sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ message: 'Error fetching projects' });
    }
};

const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ message: 'Error fetching project' });
    }
};

const createProject = async (req, res) => {
    try {
        const projectData = req.body;

        if (projectData.highlights && typeof projectData.highlights === 'string') {
            projectData.highlights = projectData.highlights.split(',').map(h => h.trim());
        }
        if (projectData.amenities && typeof projectData.amenities === 'string') {
            projectData.amenities = projectData.amenities.split(',').map(a => a.trim());
        }

        const images = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString('base64')}`, {
                    folder: 'projects',
                });
                images.push(result.secure_url);
            }
        }
        projectData.images = images;

        const project = new Project(projectData);
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Error creating project' });
    }
};

const updateProject = async (req, res) => {
    try {
        const projectData = req.body;

        if (projectData.highlights && typeof projectData.highlights === 'string') {
            projectData.highlights = projectData.highlights.split(',').map(h => h.trim());
        }
        if (projectData.amenities && typeof projectData.amenities === 'string') {
            projectData.amenities = projectData.amenities.split(',').map(a => a.trim());
        }

        const project = await Project.findByIdAndUpdate(
            req.params.id,
            projectData,
            { new: true, runValidators: true }
        );

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ message: 'Error updating project' });
    }
};

const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Error deleting project' });
    }
};

module.exports = { getAllProjects, getProjectById, createProject, updateProject, deleteProject };
