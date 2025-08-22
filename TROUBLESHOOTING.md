# 🔧 Troubleshooting Guide

## Google OAuth "GeneralOAuthFlow" Error

This error typically occurs when there are issues with the Google OAuth configuration or environment variables.

### Quick Fix Checklist

1. ✅ **Environment Variables Set**
   - `GOOGLE_CLIENT_ID` is set
   - `GOOGLE_CLIENT_SECRET` is set
   - `NEXTAUTH_SECRET` is set
   - `NEXTAUTH_URL` is set

2. ✅ **Google Cloud Console Setup**
   - OAuth 2.0 Client ID created
   - Redirect URI added: `http://localhost:3000/api/auth/callback/google`
   - Google+ API enabled

3. ✅ **Database Connection**
   - PostgreSQL running
   - Database accessible
   - Prisma schema pushed

### Step-by-Step Resolution

#### 1. Check Environment Variables

Create or update your `.env` file:

```bash
# Copy example file
cp env.example .env

# Edit with your values
nano .env
```

Required variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/reviewsautopilot"

# NextAuth
NEXTAUTH_SECRET="your-random-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

#### 2. Generate NEXTAUTH_SECRET

If you don't have a secret key:

```bash
# Generate a random secret
openssl rand -base64 32

# Or use this online generator
# https://generate-secret.vercel.app/32
```

#### 3. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select or create a project
3. Enable Google+ API (if not enabled)
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Set **Application Type** to "Web application"
6. Add **Authorized Redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy **Client ID** and **Client Secret**

#### 4. Database Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Or use the setup script
npm run setup
```

#### 5. Test Configuration

Visit `/test-auth` to debug your OAuth setup.

### Common Issues & Solutions

#### Issue: "GeneralOAuthFlow" Error
- **Cause**: Missing environment variables
- **Solution**: Check all required variables are set

#### Issue: "Invalid redirect_uri"
- **Cause**: Redirect URI mismatch
- **Solution**: Add correct URI to Google Console

#### Issue: "Client ID not found"
- **Cause**: Wrong credential type
- **Solution**: Use OAuth 2.0 Client ID, not API key

#### Issue: Database Connection Failed
- **Cause**: PostgreSQL not running or wrong credentials
- **Solution**: Check database status and connection string

### Debug Steps

1. **Check Console Logs**
   - Look for environment variable warnings
   - Check for database connection errors

2. **Test Environment Variables**
   - Visit `/test-auth` page
   - Check which variables are missing

3. **Verify Google OAuth**
   - Check redirect URI in Google Console
   - Ensure Client ID format is correct

4. **Database Connection**
   - Test database connection
   - Verify Prisma schema is pushed

### Still Having Issues?

1. **Check the test page**: Visit `/test-auth` for detailed debugging
2. **Review console logs**: Look for specific error messages
3. **Verify environment**: Ensure all variables are set correctly
4. **Test database**: Run `npm run db:studio` to check connection

### Support

If you're still experiencing issues:

1. Check the console for specific error messages
2. Verify all environment variables are set
3. Test database connection
4. Review Google Cloud Console setup

The most common cause is missing or incorrect environment variables. Double-check your `.env` file and Google Cloud Console configuration.
