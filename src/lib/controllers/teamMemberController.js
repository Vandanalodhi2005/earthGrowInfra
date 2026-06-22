const TeamMember = require('../models/TeamMember');
const { cloudinary } = require('../config/cloudinary');

// Get all team members
exports.getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find().sort({ order: 1, createdAt: -1 });
    res.json(teamMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a team member
exports.createTeamMember = async (req, res) => {
  try {
    const { name, role, bio, order } = req.body;
    let imageUrl = '';
    
    if (req.file) {
      // Upload buffer to Cloudinary
      const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
          folder: 'team',
      });
      imageUrl = result.secure_url;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    if (!imageUrl) {
        return res.status(400).json({ message: 'Image is required' });
    }

    const teamMember = new TeamMember({
      name,
      role,
      bio,
      image: imageUrl,
      order: order || 0
    });

    const newMember = await teamMember.save();
    res.status(201).json(newMember);
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update a team member
exports.updateTeamMember = async (req, res) => {
  try {
    const { name, role, bio, order } = req.body;
    const member = await TeamMember.findById(req.params.id);

    if (!member) return res.status(404).json({ message: 'Member not found' });

    member.name = name || member.name;
    member.role = role || member.role;
    member.bio = bio || member.bio;
    member.order = order !== undefined ? order : member.order;

    if (req.file) {
      const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
          folder: 'team',
      });
      member.image = result.secure_url;
    } else if (req.body.image) {
        member.image = req.body.image;
    }

    const updatedMember = await member.save();
    res.json(updatedMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a team member
exports.deleteTeamMember = async (req, res) => {
  try {
    const member = await TeamMember.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
