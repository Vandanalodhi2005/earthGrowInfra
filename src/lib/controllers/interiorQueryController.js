const InteriorQuery = require('../models/InteriorQuery');
const { sendEmail } = require('../utils/emailService');

// Create Interior Query
exports.createInteriorQuery = async (req, res) => {
  try {
    const { fullName, email, phone, serviceType, message } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !serviceType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: fullName, email, phone, and serviceType',
      });
    }

    // Create query
    const interiorQuery = new InteriorQuery({
      fullName,
      email,
      phone,
      serviceType,
      message: message || '', // Handle empty message
    });

    await interiorQuery.save();

    // Send email to admin
    const adminEmailContent = `
      <h2>New Interior Design Query</h2>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Service Type:</strong> ${serviceType}</p>
      <p><strong>Message:</strong> ${message || 'No message provided'}</p>
      <p><strong>Received at:</strong> ${new Date().toLocaleString()}</p>
    `;

    // Send email to customer
    const customerEmailContent = `
      <h2>Thank You for Your Interior Design Query</h2>
      <p>Dear ${fullName},</p>
      <p>We have received your query for ${serviceType} interior design services. Our team will contact you shortly at ${phone}.</p>
      <p>Thank you for choosing us!</p>
      <p>Best regards,<br/>The Realty Experts Team</p>
    `;

    const adminEmail = process.env.ADMIN_EMAIL || 'viodhi152@gmail.com';
    await sendEmail(adminEmail, 'New Interior Query', adminEmailContent);
    await sendEmail(email, 'Interior Design Query Confirmation', customerEmailContent);

    res.status(201).json({
      success: true,
      message: 'Interior query submitted successfully',
      data: interiorQuery,
    });
  } catch (error) {
    console.error('Error creating interior query:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting interior query',
      error: error.message,
    });
  }
};

// Get all Interior Queries (Admin only)
exports.getAllInteriorQueries = async (req, res) => {
  try {
    const queries = await InteriorQuery.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: queries,
      total: queries.length,
    });
  } catch (error) {
    console.error('Error fetching interior queries:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching interior queries',
      error: error.message,
    });
  }
};

// Update Interior Query Status (Admin only)
exports.updateInteriorQueryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const query = await InteriorQuery.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Interior query not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: query,
    });
  } catch (error) {
    console.error('Error updating interior query status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating status',
      error: error.message,
    });
  }
};

// Delete Interior Query (Admin only)
exports.deleteInteriorQuery = async (req, res) => {
  try {
    const { id } = req.params;

    const query = await InteriorQuery.findByIdAndDelete(id);

    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Interior query not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Interior query deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting interior query:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting interior query',
      error: error.message,
    });
  }
};
