const Investment = require('../models/Investment');
const { cloudinary } = require('../config/cloudinary');
const mongoose = require('mongoose');

const getAllInvestments = async (req, res) => {
    try {
        const { landType, status, city, page = 1, limit = 10 } = req.query;
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
        
        res.json({
            data: investments,
            total,
            pages: Math.ceil(total / parseInt(limit)),
            currentPage: parseInt(page)
        });
    } catch (error) {
        console.error('Error fetching investments:', error);
        res.status(500).json({ message: 'Error fetching investments', error: error.message });
    }
};

const getInvestmentById = async (req, res) => {
    try {
        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid investment ID format' });
        }

        const investment = await Investment.findById(req.params.id);
        if (!investment) {
            return res.status(404).json({ message: 'Investment not found' });
        }
        res.json(investment);
    } catch (error) {
        console.error('Error fetching investment:', error);
        res.status(500).json({ message: 'Error fetching investment', error: error.message });
    }
};

const createInvestment = async (req, res) => {
    try {
        const { title, description, location, city, area, totalPrice, landType } = req.body;

        // Validate required fields
        if (!title || !description || !location || !city || !area || !totalPrice || !landType) {
            return res.status(400).json({ 
                message: 'Missing required fields: title, description, location, city, area, totalPrice, landType' 
            });
        }

        let investmentData = { ...req.body };

        // Parse highlights if it's a string
        if (investmentData.highlights && typeof investmentData.highlights === 'string') {
            investmentData.highlights = investmentData.highlights
                .split(',')
                .map(h => h.trim())
                .filter(h => h.length > 0);
        }

        // Upload images to Cloudinary
        const images = [];
        if (req.files && req.files.length > 0) {
            try {
                for (const file of req.files) {
                    const result = await cloudinary.uploader.upload(
                        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
                        { folder: 'investments' }
                    );
                    images.push(result.secure_url);
                }
            } catch (uploadError) {
                console.error('Image upload error:', uploadError);
                return res.status(500).json({ message: 'Error uploading images', error: uploadError.message });
            }
        }
        
        investmentData.images = images;

        const investment = new Investment(investmentData);
        await investment.save();
        
        res.status(201).json({
            message: 'Investment created successfully',
            data: investment
        });
    } catch (error) {
        console.error('Error creating investment:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Validation error',
                errors: Object.values(error.errors).map(e => e.message)
            });
        }
        
        res.status(500).json({ message: 'Error creating investment', error: error.message });
    }
};

const updateInvestment = async (req, res) => {
    try {
        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid investment ID format' });
        }

        let investmentData = { ...req.body };

        // Parse highlights if it's a string
        if (investmentData.highlights && typeof investmentData.highlights === 'string') {
            investmentData.highlights = investmentData.highlights
                .split(',')
                .map(h => h.trim())
                .filter(h => h.length > 0);
        }

        // Handle new image uploads
        if (req.files && req.files.length > 0) {
            try {
                const images = [];
                for (const file of req.files) {
                    const result = await cloudinary.uploader.upload(
                        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
                        { folder: 'investments' }
                    );
                    images.push(result.secure_url);
                }
                
                // Append to existing images or replace based on your preference
                investmentData.images = images;
            } catch (uploadError) {
                console.error('Image upload error:', uploadError);
                return res.status(500).json({ message: 'Error uploading images', error: uploadError.message });
            }
        }

        const investment = await Investment.findByIdAndUpdate(
            req.params.id,
            investmentData,
            { new: true, runValidators: true }
        );

        if (!investment) {
            return res.status(404).json({ message: 'Investment not found' });
        }
        
        res.json({
            message: 'Investment updated successfully',
            data: investment
        });
    } catch (error) {
        console.error('Error updating investment:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Validation error',
                errors: Object.values(error.errors).map(e => e.message)
            });
        }
        
        res.status(500).json({ message: 'Error updating investment', error: error.message });
    }
};

const deleteInvestment = async (req, res) => {
    try {
        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid investment ID format' });
        }

        const investment = await Investment.findByIdAndDelete(req.params.id);
        if (!investment) {
            return res.status(404).json({ message: 'Investment not found' });
        }
        
        // Optional: Delete images from Cloudinary
        if (investment.images && investment.images.length > 0) {
            try {
                for (const imageUrl of investment.images) {
                    // Extract public_id from URL and delete (optional enhancement)
                    // This prevents orphaned images in Cloudinary
                }
            } catch (deleteError) {
                console.error('Error deleting images from Cloudinary:', deleteError);
                // Don't fail the request, just log the error
            }
        }
        
        res.json({ 
            message: 'Investment deleted successfully',
            data: investment
        });
    } catch (error) {
        console.error('Error deleting investment:', error);
        res.status(500).json({ message: 'Error deleting investment', error: error.message });
    }
};

module.exports = { getAllInvestments, getInvestmentById, createInvestment, updateInvestment, deleteInvestment };
