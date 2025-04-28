# Deployment Documentation

This directory contains guides for deploying the Nursing Exam application to various platforms.

## Deployment Guides

- `DEPLOYMENT.md` - Comprehensive deployment guide with detailed instructions
- `RENDER_DEPLOYMENT_STEPS.md` - Quick start guide for deploying to Render.com

## Project Structure for Deployment

The project includes several files to assist with deployment:

- `render.yaml` - Configuration for Render.com Blueprint deployments
- `Procfile` - For platforms that use Procfile configurations
- `production-server.js` - A CommonJS backup server for platforms with ESM issues
- `.env.example` - Example environment variables needed for deployment
- `tsconfig.server.json` - TypeScript configuration optimized for server builds

## Deployment Checklist

Before deploying, ensure:

1. Your server listens on process.env.PORT
2. All environment-specific configuration is handled properly
3. Static files are properly served in production
4. API endpoints are configured correctly
5. Proper error handling is in place

## Getting Help

If you encounter deployment issues, please refer to the specific platform's documentation or contact the development team for assistance.