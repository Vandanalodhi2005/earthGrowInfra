const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    status: {
        type: String,
        required: true,
        enum: ['available', 'sold', 'rented']
    },
    propertyType: {
        type: String,
        required: true,
        enum: ['apartment', 'villa', 'plot', 'commercial', 'investment']
    },
    price: {
        type: Number,
        required: true
    },
    area: {
        type: Number,
        required: true
    },
    plotArea: {
        type: Number
    },
    bedroom: {
        type: Number
    },
    transaction: {
        type: String,
        enum: ['', 'new', 'resale'],
        default: ''
    },
    furnishing: {
        type: String,
        enum: ['', 'furnished', 'semi-furnished', 'unfurnished'],
        default: ''
    },
    propertyAge: {
        type: String
    },
    // Location Information
    flatNo: {
        type: String
    },
    propertyName: {
        type: String
    },
    buildingName: {
        type: String
    },
    street: {
        type: String
    },
    landmark: {
        type: String
    },
    pinCode: {
        type: String
    },
    address: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    propertyDescription: {
        type: String
    },
    detailedInformation: {
        type: String
    },
    amenities: [{
        type: String
    }],
    youtubeUrl: {
        type: String
    },
    images: [{
        type: String
    }]
}, {
    timestamps: true
});

// Add indexes for better query performance
propertySchema.index({ status: 1 });
propertySchema.index({ propertyType: 1 });
propertySchema.index({ city: 1 });
propertySchema.index({ location: 1 });

module.exports = mongoose.models.Property || mongoose.model('Property', propertySchema);