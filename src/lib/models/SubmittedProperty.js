const mongoose = require('mongoose');

const submittedPropertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['sale', 'rent'],
        default: 'sale'
    },
    category: {
        type: String,
        enum: ['residential', 'commercial'],
        default: 'residential'
    },
    location: {
        type: String,
        required: true
    },
    bedrooms: {
        type: Number
    },
    bathrooms: {
        type: Number
    },
    area: {
        type: Number
    },
    features: [{
        type: String
    }],
    contactName: {
        type: String,
        required: true,
        trim: true
    },
    contactEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    contactPhone: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'approved', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true
});

submittedPropertySchema.index({ status: 1 });
submittedPropertySchema.index({ createdAt: -1 });

module.exports = mongoose.models.SubmittedProperty || mongoose.model('SubmittedProperty', submittedPropertySchema);
