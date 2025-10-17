const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.'
    }
});

app.use('/api/contact', limiter);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Email configuration
const createTransporter = () => {
    if (process.env.NODE_ENV === 'production') {
        // Production email service (Gmail, SendGrid, etc.)
        return nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    } else {
        // Development - using Ethereal Email for testing
        return nodemailer.createTransporter({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'ethereal.user@ethereal.email',
                pass: 'ethereal.pass'
            }
        });
    }
};

// Validation rules
const contactValidation = [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('linkedin').isURL().withMessage('Valid LinkedIn URL is required'),
    body('company').trim().isLength({ min: 2, max: 200 }).withMessage('Company name must be between 2 and 200 characters'),
    body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters')
];

// Contact form endpoint
app.post('/api/contact', contactValidation, async (req, res) => {
    try {
        // Check validation results
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { name, email, linkedin, company, message } = req.body;

        // Create email content
        const emailContent = `
            <h2>New Application from Second Chance VC Website</h2>
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>LinkedIn:</strong> <a href="${linkedin}" target="_blank">${linkedin}</a></p>
                <p><strong>Previous Company:</strong> ${company}</p>
                <p><strong>Message:</strong></p>
                <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
                    ${message.replace(/\n/g, '<br>')}
                </div>
                <hr>
                <p style="color: #666; font-size: 12px;">
                    Sent from Second Chance VC website on ${new Date().toLocaleString()}
                </p>
            </div>
        `;

        // Send email
        const transporter = createTransporter();
        
        const mailOptions = {
            from: process.env.EMAIL_FROM || 'noreply@secondchance.vc',
            to: process.env.EMAIL_TO || 'hello@secondchance.vc',
            subject: `New Application: ${name}`,
            html: emailContent,
            replyTo: email
        };

        await transporter.sendMail(mailOptions);

        // Send confirmation email to applicant
        const confirmationContent = `
            <h2>Thank you for your application to Second Chance VC!</h2>
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <p>Dear ${name},</p>
                <p>We have received your application and are excited to learn more about your vision.</p>
                <p>Our team will review your application and get back to you within 5-7 business days.</p>
                <p>In the meantime, feel free to reach out if you have any questions.</p>
                <br>
                <p>Best regards,<br>The Second Chance VC Team</p>
                <hr>
                <p style="color: #666; font-size: 12px;">
                    This is an automated message. Please do not reply to this email.
                </p>
            </div>
        `;

        const confirmationOptions = {
            from: process.env.EMAIL_FROM || 'noreply@secondchance.vc',
            to: email,
            subject: 'Application Received - Second Chance VC',
            html: confirmationContent
        };

        await transporter.sendMail(confirmationOptions);

        res.json({
            success: true,
            message: 'Application submitted successfully!'
        });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send application. Please try again later.'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Second Chance VC server running on port ${PORT}`);
    console.log(`📧 Email service: ${process.env.NODE_ENV === 'production' ? 'Production' : 'Development (Ethereal)'}`);
});

module.exports = app;

