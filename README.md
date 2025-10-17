# Second Chance VC Website

A modern, responsive website for Second Chance VC - a venture capital firm focused on second-time founders with technical expertise and AI development tools experience.

## Features

- 🌍 **Multi-language support** (English/Spanish)
- 📱 **Fully responsive** design
- 📧 **Working contact form** with email notifications
- 🔒 **Security features** (rate limiting, validation, CORS)
- ⚡ **Modern tech stack** (Node.js, Express, Nodemailer)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp env.example .env
```

Edit `.env` with your email configuration:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@secondchance.vc
EMAIL_TO=hello@secondchance.vc
PORT=3000
NODE_ENV=development
```

### 3. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The website will be available at `http://localhost:3000`

## Email Configuration

### Option 1: Gmail (Recommended for testing)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. Use your Gmail address and the app password in `.env`

### Option 2: Professional Email Services

For production, consider using:
- **SendGrid**: `npm install @sendgrid/mail`
- **AWS SES**: Configure with AWS credentials
- **Mailgun**: Use Mailgun API
- **Postmark**: Professional email service

### Option 3: Development Testing

For development, the server uses Ethereal Email (fake SMTP) by default. Check the console for test email links.

## Project Structure

```
SecondChance/
├── index.html          # Main website
├── styles.css          # Styling
├── script.js           # Frontend JavaScript
├── server.js           # Backend server
├── package.json        # Dependencies
├── env.example         # Environment template
└── README.md           # This file
```

## API Endpoints

### POST /api/contact
Submit contact form application

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "linkedin": "https://linkedin.com/in/johndoe",
  "company": "Previous Company Inc",
  "message": "My story and vision..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application submitted successfully!"
}
```

### GET /api/health
Health check endpoint

## Security Features

- **Rate Limiting**: 5 requests per 15 minutes per IP
- **Input Validation**: Server-side validation for all fields
- **CORS Protection**: Configured for security
- **Helmet**: Security headers
- **Email Validation**: LinkedIn URL and email format validation

## Deployment Options

### 1. Heroku
```bash
# Install Heroku CLI
# Create Procfile
echo "web: node server.js" > Procfile

# Deploy
git init
git add .
git commit -m "Initial commit"
heroku create second-chance-vc
git push heroku main
```

### 2. Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### 3. DigitalOcean App Platform
- Connect your GitHub repository
- Configure environment variables
- Deploy automatically

### 4. AWS EC2
```bash
# Install PM2 for process management
npm install -g pm2

# Start application
pm2 start server.js --name "second-chance-vc"
pm2 save
pm2 startup
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `EMAIL_USER` | Email service username | Yes |
| `EMAIL_PASS` | Email service password | Yes |
| `EMAIL_FROM` | From email address | No |
| `EMAIL_TO` | Recipient email address | No |
| `PORT` | Server port | No (default: 3000) |
| `NODE_ENV` | Environment mode | No |

## Troubleshooting

### Email not sending?
1. Check your email credentials in `.env`
2. Verify 2FA is enabled for Gmail
3. Check spam folder for test emails
4. Review server logs for error messages

### Form validation errors?
1. Ensure all fields are filled
2. Check LinkedIn URL format: `https://linkedin.com/in/username`
3. Verify email format is correct

### Rate limiting?
- Wait 15 minutes between submissions
- Use different IP address for testing
- Adjust rate limit in `server.js` if needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For technical support or questions:
- Email: hello@secondchance.vc
- LinkedIn: [Second Chance VC](https://linkedin.com/company/second-chance-vc)

---

**Second Chance VC** - Investing in founders who deserve a second chance.

