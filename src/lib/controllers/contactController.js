const Contact = require('../models/Contact');
const { sendEmailNotification } = require('../utils/emailService');

const getAllContacts = async(req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Error fetching contacts' });
    }
};

const getContactById = async(req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.json(contact);
    } catch (error) {
        console.error('Error fetching contact:', error);
        res.status(500).json({ message: 'Error fetching contact' });
    }
};

const createContact = async(req, res) => {
    try {
        const { name, email, phone, message, propertyId, propertyTitle } = req.body;

        const isPropertyInquiry = !!propertyId;
        const finalMessage = isPropertyInquiry ? 
            `Property Inquiry: ${propertyTitle}\n\n${message}` : message;

        const contactData = {
            name,
            email,
            phone,
            message: finalMessage
        };

        const contact = new Contact(contactData);
        await contact.save();

        // Send Email Notification
        const emailSubject = isPropertyInquiry ? `New Property Inquiry: ${propertyTitle}` : 'New General Contact Inquiry';
        const emailHtml = `
            <h3>New Inquiry from ${name}</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Message:</strong></p>
            <p>${finalMessage.replace(/\n/g, '<br>')}</p>
        `;

        await sendEmailNotification(emailSubject, emailHtml);

        res.status(201).json({
            message: 'Message sent successfully',
            contact,
            isPropertyInquiry
        });
    } catch (error) {
        console.error('Error creating contact:', error);
        res.status(500).json({ message: 'Error sending message' });
    }
};

const updateContactStatus = async(req, res) => {
    try {
        const { status } = req.body;
        const contact = await Contact.findByIdAndUpdate(
            req.params.id, { status }, { new: true, runValidators: true }
        );
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.json(contact);
    } catch (error) {
        console.error('Error updating contact status:', error);
        res.status(500).json({ message: 'Error updating contact status' });
    }
};

const deleteContact = async(req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.json({ message: 'Inquiry deleted successfully' });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ message: 'Error deleting contact' });
    }
};

module.exports = { getAllContacts, getContactById, createContact, updateContactStatus, deleteContact };