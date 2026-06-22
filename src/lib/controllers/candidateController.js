const CandidateInquiry = require('../models/CandidateInquiry');
const { sendEmail } = require('../utils/emailService');

// Submit job application
exports.submitApplication = async (req, res) => {
  try {
    const { fullName, email, mobile, position, experience, location, message } = req.body;

    // Validate required fields
    if (!fullName || !email || !mobile || !position || experience === undefined || experience === null || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Ensure experience is a number
    const experienceNum = Number(experience);
    if (isNaN(experienceNum) || experienceNum < 0) {
      return res.status(400).json({
        success: false,
        message: 'Experience must be a valid non-negative number',
      });
    }

    // Create candidate inquiry
    const candidate = new CandidateInquiry({
      fullName,
      email,
      mobile,
      position,
      experience: experienceNum,
      location,
      message,
    });

    await candidate.save();

    // Send email to admin
    const adminEmailContent = `
      <h2>New Job Application Received</h2>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mobile:</strong> ${mobile}</p>
      <p><strong>Position:</strong> ${position}</p>
      <p><strong>Location:</strong> ${location}</p>
      <p><strong>Experience (Years):</strong> ${experienceNum}</p>
      <p><strong>Message:</strong> ${message || 'N/A'}</p>
      <p><strong>Applied at:</strong> ${new Date().toLocaleString()}</p>
    `;

    // Send email to candidate
    const candidateEmailContent = `
      <h2>Application Received</h2>
      <p>Dear ${fullName},</p>
      <p>Thank you for applying for the position of <strong>${position}</strong> at The Realty Experts.</p>
      <p>We have received your application and our HR team will review it shortly. If your profile matches our requirements, we will contact you at ${mobile}.</p>
      <p>Best regards,<br/>HR Team - The Realty Experts</p>
    `;

    // Send emails without blocking the response
    sendEmail(process.env.ADMIN_EMAIL, 'New Job Application', adminEmailContent).catch(err => 
      console.error('Failed to send admin email:', err)
    );
    sendEmail(email, 'Application Received - The Realty Experts', candidateEmailContent).catch(err => 
      console.error('Failed to send candidate email:', err)
    );

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: candidate,
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting application',
      error: error.message,
    });
  }
};

// Get all applications (Admin only)
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await CandidateInquiry.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: applications,
      total: applications.length,
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message,
    });
  }
};

// Get applications by position
exports.getApplicationsByPosition = async (req, res) => {
  try {
    const { position } = req.params;

    const applications = await CandidateInquiry.find({ position }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: applications,
      total: applications.length,
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message,
    });
  }
};

// Update application status (Admin only)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await CandidateInquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: application,
    });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating application',
      error: error.message,
    });
  }
};

// Delete application (Admin only)
exports.deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await CandidateInquiry.findByIdAndDelete(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting application',
      error: error.message,
    });
  }
};
