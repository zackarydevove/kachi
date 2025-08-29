..

# Email Setup

Add the following environment variables to your `.env` file in the backend directory:

```env
# Email Configuration (SMTP)
SMTP_HOST="smtp-mail.outlook.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@outlook.com"
SMTP_PASS="your-app-password"
SMTP_FROM="Kachi <your-email@outlook.com>"
```

# Google OAuth Setup

Add the following environment variables to your `.env` file in the backend directory:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID="your-google-client-id-here"
GOOGLE_CLIENT_SECRET="your-google-client-secret-here"
GOOGLE_REDIRECT_URI="http://localhost:3000/auth/google/callback"
```
