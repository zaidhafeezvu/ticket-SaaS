# GitHub OAuth Setup Guide

This guide explains how to set up and use GitHub OAuth authentication in the Ticket Marketplace SaaS application.

## Overview

GitHub OAuth has been integrated into the authentication system, allowing users to sign up and sign in using their GitHub accounts. This provides a seamless authentication experience without the need to create and remember new passwords.

## Features

- ✅ Sign in with GitHub button on login page
- ✅ Sign up with GitHub button on signup page  
- ✅ Automatic user profile creation from GitHub data
- ✅ Secure OAuth 2.0 flow handled by Better Auth
- ✅ Works alongside existing email/password authentication

## Setup Instructions

### 1. Create a GitHub OAuth Application

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click on **"OAuth Apps"** in the sidebar
3. Click **"New OAuth App"** button
4. Fill in the application details:
   - **Application name**: `TicketSaaS` (or your preferred name)
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Application description**: Optional description of your app
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
5. Click **"Register application"**
6. You'll be redirected to your app's settings page
7. Copy the **Client ID** (you'll need this for your `.env` file)
8. Click **"Generate a new client secret"**
9. Copy the **Client Secret** immediately (you won't be able to see it again)

### 2. Configure Environment Variables

Add the following to your `.env` file:

```env
# GitHub OAuth Configuration
GITHUB_CLIENT_ID="your-github-client-id-here"
GITHUB_CLIENT_SECRET="your-github-client-secret-here"
```

Replace `your-github-client-id-here` and `your-github-client-secret-here` with the values from step 1.

### 3. Restart the Development Server

If the server is already running, restart it to pick up the new environment variables:

```bash
# Stop the server (Ctrl+C)
# Then restart it
npm run dev
# or
bun run dev
```

## Testing the Integration

### Test Sign Up with GitHub

1. Open http://localhost:3000/auth/signup
2. You should see a **"Sign up with GitHub"** button above the email form
3. Click the button
4. You'll be redirected to GitHub's authorization page
5. Click **"Authorize"** to grant access
6. You'll be redirected back to the application (to `/dashboard`)
7. Your account is now created using your GitHub profile information

### Test Sign In with GitHub

1. Open http://localhost:3000/auth/login
2. You should see a **"Sign in with GitHub"** button below the email form
3. Click the button
4. You'll be redirected to GitHub (if not already authenticated)
5. After authorization, you'll be redirected to `/dashboard`
6. You're now signed in with your GitHub account

## Production Deployment

When deploying to production:

### 1. Create a Production OAuth App

Either update your existing OAuth App or create a new one:
- **Homepage URL**: `https://yourdomain.com`
- **Authorization callback URL**: `https://yourdomain.com/api/auth/callback/github`

### 2. Update Environment Variables

Set the production environment variables on your hosting platform:

```env
BETTER_AUTH_URL="https://yourdomain.com"
GITHUB_CLIENT_ID="your-production-client-id"
GITHUB_CLIENT_SECRET="your-production-client-secret"
```

Leave `NEXT_PUBLIC_BETTER_AUTH_URL` unset in production to use relative URLs.

## How It Works

### Authentication Flow

1. User clicks "Sign in with GitHub" button
2. User is redirected to GitHub's OAuth authorization page
3. User grants permission to the application
4. GitHub redirects back to `/api/auth/callback/github` with an authorization code
5. Better Auth exchanges the code for an access token
6. Better Auth retrieves the user's profile from GitHub
7. If the user doesn't exist, a new user account is created
8. User is redirected to the dashboard with an active session

### Data Stored

When a user signs in with GitHub, the following information is stored:

- **User Table**: Basic profile information (name, email, avatar)
- **Account Table**: GitHub account ID, access token (for future API calls if needed)
- **Session Table**: Active session token

## Troubleshooting

### "GitHub OAuth is not configured" Warning

If you see this warning during build:
- This is expected when `GITHUB_CLIENT_ID` or `GITHUB_CLIENT_SECRET` are not set
- The application will still work with email/password authentication
- Set the environment variables to enable GitHub OAuth

### OAuth Button Not Working

1. Check that environment variables are set correctly
2. Verify the callback URL matches exactly: `http://localhost:3000/api/auth/callback/github`
3. Ensure the GitHub OAuth App is not suspended
4. Check browser console for error messages

### "Redirect URI Mismatch" Error

This means the callback URL in your GitHub OAuth App settings doesn't match the one in the request:
- Verify the callback URL in GitHub settings: `http://localhost:3000/api/auth/callback/github` (dev) or `https://yourdomain.com/api/auth/callback/github` (prod)
- Ensure there are no trailing slashes
- Check that you're using the correct protocol (http vs https)

### User Created but Missing Email

Some GitHub users have their email set to private:
- The application will still create the account
- The email field may be empty or use GitHub's noreply email
- Users can update their profile information later

## Security Considerations

### Token Storage

- Access tokens are stored securely in the database
- Tokens are encrypted at rest (by the database)
- Only the application has access to these tokens

### Scope Permissions

The application requests minimal GitHub permissions:
- `user:email` - Read user's email addresses
- Profile information (name, avatar) is publicly accessible

### Best Practices

- ✅ Never commit client secrets to version control
- ✅ Use different OAuth Apps for development and production
- ✅ Regularly rotate client secrets
- ✅ Monitor OAuth App access logs on GitHub
- ✅ Use HTTPS in production (required by OAuth)

## Additional Resources

- [Better Auth Social Providers Documentation](https://www.better-auth.com/docs/social-providers)
- [GitHub OAuth Apps Documentation](https://docs.github.com/en/apps/oauth-apps)
- [OAuth 2.0 Specification](https://oauth.net/2/)

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Review the server logs for detailed error information
3. Verify all environment variables are set correctly
4. Ensure the GitHub OAuth App is properly configured
5. Check [AUTHENTICATION.md](./AUTHENTICATION.md) for general authentication issues
