const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    jobTiming: {
      type: String,
      required: true,
      enum: ['Full Time', 'Part Time', 'Contract', 'Internship'],
    },
    numberOfOpenings: {
      type: Number,
      required: true,
      default: 1,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: String,
    },
    salary: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'draft'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.JobPosting || mongoose.model('JobPosting', jobPostingSchema);
