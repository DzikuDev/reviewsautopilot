# Google Business Integration Testing Guide

## Overview

This guide explains how to test the complete Google Business integration flow, from connecting your account to receiving reviews and generating AI responses.

## Prerequisites

1. **Google Business Profile Account**
   - Must have a verified business location
   - Admin access to manage reviews and replies

2. **Google Cloud Project**
   - OAuth 2.0 credentials configured
   - Google My Business API enabled
   - Valid `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

3. **Environment Variables**
   ```bash
   GOOGLE_CLIENT_ID="your-oauth-client-id"
   GOOGLE_CLIENT_SECRET="your-oauth-client-secret"
   GOOGLE_OAUTH_SCOPES="https://www.googleapis.com/auth/business.manage"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret"
   ```

## Testing Flow

### 1. Connect Google Business Account

1. **Navigate to Integrations Page**
   - Go to `/integrations` in your app
   - Click "Connect Google" button

2. **OAuth Flow**
   - Redirected to Google consent screen
   - Grant permissions for business management
   - Redirected back to app with success message

3. **Verify Connection**
   - Check database for new integration record
   - Verify access token and refresh token stored

### 2. Test Review Sync

1. **Manual Sync**
   - Go to dashboard or reviews page
   - Click "Sync Reviews" button
   - Check console for API calls to Google

2. **Verify Data**
   - Reviews should appear in your app
   - Check that all review fields are populated
   - Verify location and business information

### 3. Test AI Response Generation

1. **Create Tone Profile**
   - Go to `/tone-profiles`
   - Create a profile (e.g., "Professional & Friendly")
   - Set formality, emotion, length, and personality

2. **Create Response Template**
   - Go to `/templates`
   - Create template with variables like `{{business_name}}`, `{{rating}}`
   - Set rating filters if desired

3. **Generate Draft Response**
   - Go to a specific review
   - Click "Reply" button
   - Select tone profile and template
   - Click "Generate Draft"

4. **Review AI Response**
   - Check generated content quality
   - Verify template variables are replaced
   - Check for policy violations

### 4. Test Reply Publishing

1. **Approve Draft**
   - Review the AI-generated response
   - Make any necessary edits
   - Click "Approve & Publish"

2. **Verify Google API Call**
   - Check console for API request to Google
   - Verify response is posted to Google Business
   - Check Google Business Profile for the reply

## Real-World Testing Scenarios

### Scenario 1: New 5-Star Review

1. **Write a real review** on your Google Business Profile
2. **Sync reviews** in your app
3. **Generate AI response** using positive tone profile
4. **Publish reply** and verify it appears on Google

### Scenario 2: Negative Review Response

1. **Write a 3-star or lower review** on Google Business
2. **Sync and generate response** using empathetic tone
3. **Verify policy compliance** (no promises, proper escalation)
4. **Publish and check** response quality

### Scenario 3: Multi-Language Review

1. **Write review in different language** (if your business supports it)
2. **Test AI generation** with language context
3. **Verify response** maintains appropriate language

## Troubleshooting

### Common Issues

1. **OAuth Errors**
   - Check client ID/secret configuration
   - Verify redirect URI matches exactly
   - Check Google Cloud Console API settings

2. **API Permission Errors**
   - Ensure Google My Business API is enabled
   - Check OAuth scopes include business.manage
   - Verify business location is verified

3. **Review Sync Issues**
   - Check access token expiration
   - Verify location ID is correct
   - Check API rate limits

4. **AI Generation Problems**
   - Verify AI model configuration
   - Check template syntax
   - Verify tone profile settings

### Debug Steps

1. **Check Console Logs**
   - API request/response details
   - Error messages and stack traces
   - OAuth flow debugging

2. **Verify Database**
   - Integration records
   - Review data completeness
   - Draft and reply status

3. **Test API Endpoints**
   - Use Postman or similar tool
   - Test Google Business API directly
   - Verify authentication tokens

## Performance Testing

### Load Testing

1. **Multiple Reviews**
   - Sync 100+ reviews
   - Generate responses for multiple reviews
   - Monitor API response times

2. **Concurrent Operations**
   - Multiple users generating drafts
   - Simultaneous review syncs
   - Parallel reply publishing

### Monitoring

1. **API Rate Limits**
   - Google Business API quotas
   - Response time monitoring
   - Error rate tracking

2. **System Resources**
   - Database performance
   - AI model response times
   - Memory and CPU usage

## Security Testing

1. **Token Security**
   - Verify tokens are encrypted in database
   - Check refresh token rotation
   - Test token expiration handling

2. **Access Control**
   - Verify user can only access their business data
   - Test cross-organization access prevention
   - Verify OAuth scope restrictions

## Next Steps

After successful testing:

1. **Production Deployment**
   - Update environment variables
   - Configure monitoring and logging
   - Set up error alerting

2. **Automation**
   - Implement scheduled review syncs
   - Add webhook support (if Google provides)
   - Set up auto-response rules

3. **Scaling**
   - Multiple business locations
   - Team member access
   - Advanced AI features

## Support

For issues or questions:
- Check console logs and error messages
- Verify configuration and permissions
- Test with Google's API testing tools
- Review Google Business API documentation

