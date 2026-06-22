const nodemailer = require('nodemailer');

// Configure the email transporter
// You MUST set EMAIL_USER and EMAIL_PASS in your .env file
// EMAIL_PASS should be a Google App Password if using Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Sends an email notification to the administrator
 * @param {string} subject - The subject of the email
 * @param {string} htmlContent - The HTML content/body of the email
 */
const sendEmailNotification = async (subject, htmlContent) => {
    // Check if configuration exists
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.ADMIN_EMAIL) {
        console.warn('WARNING: Email notification skipped. EMAIL_USER, EMAIL_PASS, or ADMIN_EMAIL not set in .env');
        return false;
    }

    const recipientEmail = process.env.ADMIN_EMAIL;

    try {
        const mailOptions = {
            from: `"Realty Xperts Portal" <${process.env.EMAIL_USER}>`,
            to: recipientEmail,
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px; max-width: 600px; margin: auto;">
                    <div style="background-color: #07162F; color: white; padding: 15px; border-radius: 8px 8px 0 0; text-align: center;">
                        <h2 style="margin: 0;">Realty Xperts - New Inquiry</h2>
                    </div>
                    <div style="padding: 20px; line-height: 1.6; color: #333;">
                        ${htmlContent}
                    </div>
                    <hr style="border: 0; border-top: 1px solid #eee;" />
                    <p style="font-size: 12px; color: #888; text-align: center;">
                        This is an automated notification from your website dashboard.<br>
                        Sent on: ${new Date().toLocaleString()}
                    </p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Admin notification email sent successfully:', info.messageId);
        return true;
    } catch (error) {
        console.error('Email sending failed:', error.message);
        return false;
    }
};

/**
 * Sends an email to any recipient
 * @param {string} recipientEmail - The recipient email address
 * @param {string} subject - The subject of the email
 * @param {string} htmlContent - The HTML content/body of the email
 */
const sendEmail = async (recipientEmail, subject, htmlContent) => {
    // Check if configuration exists
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('WARNING: Email skipped. EMAIL_USER or EMAIL_PASS not set in .env');
        return false;
    }

    try {
        const mailOptions = {
            from: `"Realty Xperts" <${process.env.EMAIL_USER}>`,
            to: recipientEmail,
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px; max-width: 600px; margin: auto;">
                    <div style="background-color: #07162F; color: white; padding: 15px; border-radius: 8px 8px 0 0; text-align: center;">
                        <h2 style="margin: 0;">Realty Xperts</h2>
                    </div>
                    <div style="padding: 20px; line-height: 1.6; color: #333;">
                        ${htmlContent}
                    </div>
                    <hr style="border: 0; border-top: 1px solid #eee;" />
                    <p style="font-size: 12px; color: #888; text-align: center;">
                        Sent on: ${new Date().toLocaleString()}
                    </p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        return true;
    } catch (error) {
        console.error('Email sending failed:', error.message);
        return false;
    }
};

module.exports = { sendEmailNotification, sendEmail };
