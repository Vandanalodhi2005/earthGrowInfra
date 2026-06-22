const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    category: { type: String },
    title: {
        type: String,
        required: true,
        trim: true
    },
    type: { type: String },
    commercialTypes: [{ type: String }],
    location: { type: String, required: true },
    city: { type: String, required: true, default: 'Bhopal' },
    price: { type: String, required: true },
    status: { type: String, default: 'upcoming' },
    description: { type: String, required: true },
    highlights: [{ type: String }],
    amenities: [{ type: String }],
    images: [{ type: String }],
    youtubeUrl: { type: String },
    
    // Resale specific fields
    propertyType: { type: String },
    area: { type: String },
    plotArea: { type: String },
    bedroom: { type: String },
    transaction: { type: String },
    furnishing: { type: String },
    propertyAge: { type: String },
    flatNo: { type: String },
    propertyName: { type: String },
    buildingName: { type: String },
    street: { type: String },
    landmark: { type: String },
    pinCode: { type: String },
    address: { type: String },
    propertyDescription: { type: String },
    detailedInformation: { type: String },

    // Interior specific field
    interiorFor: { type: String }
}, {
    timestamps: true,
    strict: false
});

projectSchema.index({ status: 1 });
projectSchema.index({ type: 1 });

module.exports = mongoose.models.Project || mongoose.model('Project', projectSchema);
