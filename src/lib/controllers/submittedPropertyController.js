const SubmittedProperty = require('../models/SubmittedProperty');
const { sendEmailNotification } = require('../utils/emailService');

const createSubmittedProperty = async (req, res) => {
    try {
        const propertyData = req.body;

        if (propertyData.features && typeof propertyData.features === 'string') {
            propertyData.features = propertyData.features.split(',').map(f => f.trim());
        }

        const submittedProperty = new SubmittedProperty(propertyData);
        await submittedProperty.save();

        // Send Email Notification
        const emailSubject = `New Property Submission: ${propertyData.title}`;
        const emailHtml = `
            <h3>New Property Submission for Analysis</h3>
            <p><strong>Owner Name:</strong> ${propertyData.contactName}</p>
            <p><strong>Owner Email:</strong> ${propertyData.contactEmail}</p>
            <p><strong>Owner Phone:</strong> ${propertyData.contactPhone}</p>
            <p><strong>Property Title:</strong> ${propertyData.title}</p>
            <p><strong>Category:</strong> ${propertyData.category}</p>
            <p><strong>Price Requested:</strong> ₹${propertyData.price?.toLocaleString() || 'N/A'}</p>
            <p><strong>Location:</strong> ${propertyData.location}</p>
            <p><strong>Details:</strong> ${propertyData.message || 'No description provided'}</p>
        `;

        await sendEmailNotification(emailSubject, emailHtml);

        res.status(201).json({ message: 'Property submitted successfully', submittedProperty });
    } catch (error) {
        console.error('Error submitting property:', error);
        res.status(500).json({ message: 'Error submitting property' });
    }
};

const getAllSubmittedProperties = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status) query.status = status;

        const submissions = await SubmittedProperty.find(query).sort({ createdAt: -1 });
        res.json(submissions);
    } catch (error) {
        console.error('Error fetching submitted properties:', error);
        res.status(500).json({ message: 'Error fetching submitted properties' });
    }
};

const updateSubmittedPropertyStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const submission = await SubmittedProperty.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }
        res.json(submission);
    } catch (error) {
        console.error('Error updating submission status:', error);
        res.status(500).json({ message: 'Error updating submission status' });
    }
};

const deleteSubmittedProperty = async (req, res) => {
    try {
        const submission = await SubmittedProperty.findByIdAndDelete(req.params.id);
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }
        res.json({ message: 'Submission deleted successfully' });
    } catch (error) {
        console.error('Error deleting submission:', error);
        res.status(500).json({ message: 'Error deleting submission' });
    }
};

module.exports = { createSubmittedProperty, getAllSubmittedProperties, updateSubmittedPropertyStatus, deleteSubmittedProperty };
