const mongoose = require('mongoose');

const interiorQuerySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    serviceType: {
      type: String,
      enum: ['1BHK', '2BHK', '3BHK', '4BHK', 'Office Space', 'Cafe/Restaurant', 'Clinic/Hospital', 'Salon', 'Retail Store', 'Other'],
      required: true,
    },
    message: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'converted', 'rejected'],
      default: 'new',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.InteriorQuery || mongoose.model('InteriorQuery', interiorQuerySchema);
