const JobPosting = require('../models/JobPosting');

// Create a new job posting
exports.createJobPosting = async (req, res) => {
  try {
    const { title, experience, location, jobTiming, numberOfOpenings, description, requirements, salary, status } = req.body;

    // Validate required fields
    if (!title || !experience || !location || !jobTiming || !numberOfOpenings || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Create job posting
    const jobPosting = new JobPosting({
      title,
      experience,
      location,
      jobTiming,
      numberOfOpenings,
      description,
      requirements,
      salary,
      status: status || 'active',
    });

    await jobPosting.save();

    res.status(201).json({
      success: true,
      message: 'Job posting created successfully',
      data: jobPosting,
    });
  } catch (error) {
    console.error('Error creating job posting:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating job posting',
      error: error.message,
    });
  }
};

// Get all job postings (Admin)
exports.getAllJobPostings = async (req, res) => {
  try {
    const jobPostings = await JobPosting.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: jobPostings,
      total: jobPostings.length,
    });
  } catch (error) {
    console.error('Error fetching job postings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job postings',
      error: error.message,
    });
  }
};

// Get active job postings (Public)
exports.getActiveJobPostings = async (req, res) => {
  try {
    const jobPostings = await JobPosting.find({ status: 'active' }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: jobPostings,
      total: jobPostings.length,
    });
  } catch (error) {
    console.error('Error fetching active job postings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching active job postings',
      error: error.message,
    });
  }
};

// Get single job posting by ID
exports.getJobPostingById = async (req, res) => {
  try {
    const jobPosting = await JobPosting.findById(req.params.id);

    if (!jobPosting) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    res.status(200).json({
      success: true,
      data: jobPosting,
    });
  } catch (error) {
    console.error('Error fetching job posting:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job posting',
      error: error.message,
    });
  }
};

// Update job posting
exports.updateJobPosting = async (req, res) => {
  try {
    const { title, experience, location, jobTiming, numberOfOpenings, description, requirements, salary, status } = req.body;

    const jobPosting = await JobPosting.findByIdAndUpdate(
      req.params.id,
      {
        title,
        experience,
        location,
        jobTiming,
        numberOfOpenings,
        description,
        requirements,
        salary,
        status,
      },
      { new: true, runValidators: true }
    );

    if (!jobPosting) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job posting updated successfully',
      data: jobPosting,
    });
  } catch (error) {
    console.error('Error updating job posting:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating job posting',
      error: error.message,
    });
  }
};

// Delete job posting
exports.deleteJobPosting = async (req, res) => {
  try {
    const jobPosting = await JobPosting.findByIdAndDelete(req.params.id);

    if (!jobPosting) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job posting deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting job posting:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting job posting',
      error: error.message,
    });
  }
};
