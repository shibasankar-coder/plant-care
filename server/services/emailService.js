const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
    try {
        // Create a transporter using SMTP
        // For production, use actual SMTP settings in .env
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // your email
                pass: process.env.EMAIL_PASS  // your app password
            }
        });

        const mailOptions = {
            from: `"Plant Care Reminder" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = { sendEmail };
