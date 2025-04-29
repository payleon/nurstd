# NURS'TD NCLEX PREP - Production Deployment Guide

This guide provides instructions for deploying the NURS'TD NCLEX PREP application to production environments.

## Prerequisites

- Node.js (v16+)
- npm or yarn
- Access to hosting service (Replit, Render, Vercel, etc.)

## Build Process

Our application uses a two-step build process:
1. Build the client-side React application with Vite
2. Bundle the server-side code with esbuild

### Building the Application

```bash
# Install dependencies
npm install

# Build the application
npm run build

# This will:
# - Build the client-side React application into dist/public/
# - Bundle the server-side code into dist/index.js
```

## Production Configuration

### Environment Variables

Create a `.env` file in the production environment with the following variables:

```
NODE_ENV=production
PORT=5000 # Or your preferred port
```

### Security Considerations

Our application implements the following security measures:

- **Content Security Policy (CSP)** - Restricts the sources from which content can be loaded
- **HTTP Strict Transport Security (HSTS)** - Forces HTTPS connections
- **Cross-Origin Resource Sharing (CORS)** - Restricts API access to trusted domains
- **XSS Protection** - Sanitizes user inputs to prevent cross-site scripting attacks
- **Security.txt** - Provides contact information for security researchers

### Production Server

We provide two options for running the production server:

1. **ESM-based server** (default):
   ```bash
   npm run start
   ```
   This uses the bundled ESM server from the build step.

2. **CommonJS fallback server**:
   ```bash
   node production-server.js
   ```
   This is a CommonJS server useful for environments with ESM compatibility issues.

## Deployment to Hosting Platforms

### Replit

1. Create a new Repl from GitHub
2. Set up the appropriate run command in the `.replit` file:
   ```
   run = "npm run start"
   ```
3. Add any necessary secrets in the Replit UI

### Render

1. Connect your GitHub repository
2. Configure as a Web Service
3. Set the build command:
   ```
   npm install && npm run build
   ```
4. Set the start command:
   ```
   node dist/index.js
   ```
5. Add environment variables in the Render Dashboard

## Post-Deployment Verification

After deploying, verify that:

1. The application loads correctly
2. API endpoints are working
3. Google Fonts are loading properly
4. Security headers are in place (you can use [Security Headers](https://securityheaders.com/) to check)

## Troubleshooting

### Common Issues

- **Missing static files**: Ensure the build process completed successfully and files are in `dist/public/`
- **API 404 errors**: Check that API routes are properly registered in the server
- **Font loading issues**: Verify that the CSP allows googleapis.com and gstatic.com domains
- **CORS errors**: Ensure the allowed origins list includes your application domain

### Emergency Rollback

If you encounter critical issues with the new deployment:

1. Revert to the previous commit:
   ```bash
   git checkout [previous-commit-hash]
   ```
2. Rebuild and redeploy

## Regular Maintenance

- Update dependencies regularly
- Monitor for security advisories
- Check for browser compatibility issues