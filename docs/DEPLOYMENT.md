# Nursing Exam Application Deployment Guide

This guide provides detailed instructions for deploying the Nursing Exam application to Render.com.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Preparing Your Project](#preparing-your-project)
3. [Deploying to Render](#deploying-to-render)
4. [Environment Variables](#environment-variables)
5. [Database Setup (Optional)](#database-setup-optional)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

- A [Render.com](https://render.com) account
- A GitHub or GitLab repository containing your project
- Node.js and npm installed locally for testing

## Preparing Your Project

Before deploying, ensure your project is properly configured:

1. **Verify Port Configuration**: Make sure your server listens on the port provided by the environment:
   ```javascript
   const port = process.env.PORT || 5000;
   ```

2. **Build Script**: Ensure your package.json has the correct build script:
   ```json
   "scripts": {
     "build": "vite build && esbuild server/**/*.ts shared/**/*.ts --platform=node --packages=external --bundle --format=esm --outdir=dist/server",
     "start": "NODE_ENV=production node dist/server/index.js"
   }
   ```

3. **Static Files**: The server must correctly serve static files from the build directory.

4. **Test Locally**: Run the build and start commands locally to verify everything works:
   ```bash
   npm run build
   npm start
   ```

## Deploying to Render

### Using render.yaml (Recommended)

1. We've provided a `render.yaml` file for easy deployment.
2. From your Render dashboard, go to "Blueprints".
3. Connect your repository.
4. Render will automatically detect the `render.yaml` file and create the required services.
5. Review the configuration and click "Apply".

### Manual Setup

If you prefer to set up manually:

1. From your Render dashboard, click "New +" and select "Web Service".
2. Connect your repository.
3. Configure your service:
   - **Name**: nursing-exam-app (or your preferred name)
   - **Environment**: Node
   - **Region**: Choose the one closest to your users
   - **Branch**: main (or your deployment branch)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Select appropriate plan (Free tier is available)

4. Click "Create Web Service".

## Environment Variables

Configure these environment variables in your Render dashboard:

1. **Required Variables**:
   - `NODE_ENV`: Set to `production`
   - `PORT`: Render automatically sets this, but you can specify `5000` if needed

2. **Optional Variables**:
   - `DATABASE_URL`: If using a database
   - `SESSION_SECRET`: For secure session management

## Database Setup (Optional)

If your application requires a database:

1. From your Render dashboard, click "New +" and select "PostgreSQL".
2. Configure your database settings.
3. Once created, Render will provide a connection string.
4. Add this connection string as the `DATABASE_URL` environment variable in your web service.

## Troubleshooting

### Application Not Starting

**Symptoms**: Service crashes immediately after deployment.

**Solutions**:
- Check the start command in your Render configuration.
- Verify that the build command is generating the expected files.
- Check Render logs for specific error messages.

### Static Assets Not Loading

**Symptoms**: The application loads but CSS, JavaScript, or images are missing.

**Solutions**:
- Ensure the build process is correctly generating static assets.
- Verify the static file serving configuration in your server code.

### Database Connection Issues

**Symptoms**: Application starts but can't connect to the database.

**Solutions**:
- Verify the `DATABASE_URL` environment variable is correctly set.
- Check if your database service is running.
- Ensure your application has proper error handling for database connections.

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Node.js on Render](https://render.com/docs/deploy-node-express-app)
- [Render Environment Variables](https://render.com/docs/environment-variables)

---

If you encounter any issues not covered in this guide, please contact the development team or visit the Render support forums for assistance.