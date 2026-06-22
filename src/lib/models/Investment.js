const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    area: {
        type: Number,
        required: true
    },
    areaUnit: {
        type: String,
        enum: ['sq.ft', 'sq.yard', 'acre', 'hectare', 'bigha'],
        default: 'sq.ft'
    },
    pricePerUnit: {
        type: Number
    },
    totalPrice: {
        type: Number,
        required: true
    },
    landType: {
        type: String,
        required: true,
        enum: ['agricultural', 'residential', 'commercial', 'industrial', 'mixed']
    },
    status: {
        type: String,
        enum: ['available', 'sold', 'upcoming'],
        default: 'available'
    },
    highlights: [{
        type: String
    }],
    nearbyPlaces: {
        type: String
    },
    images: [{
        type: String
    }],
    mapUrl: {
        type: String
    }
}, {
    timestamps: true
});

investmentSchema.index({ status: 1 });
investmentSchema.index({ landType: 1 });
investmentSchema.index({ city: 1 });

module.exports = mongoose.models.Investment || mongoose.model('Investment', investmentSchema);
