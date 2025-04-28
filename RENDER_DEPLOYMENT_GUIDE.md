# Render Deployment Guide for Nursing Exam App

This guide will help you deploy your Nursing Exam application to Render.com.

## Step 1: Prepare Your Project

### Update package.json Scripts

In your package.json, update the scripts section:

```json
"scripts": {
  "dev": "NODE_ENV=development tsx server/index.ts",
  "build": "vite build && esbuild server/**/*.ts shared/**/*.ts --platform=node --packages=external --bundle --format=esm --outdir=dist/server",
  "start": "NODE_ENV=production node dist/server/index.js",
  "check": "tsc",
  "db:push": "drizzle-kit push"
}
```

### Update server/vite.ts

The current production build expects to find static files in `server/public`. Update the `serveStatic` function in `server/vite.ts`:

```typescript
export function serveStatic(app: Express) {
  // Update the path to point to the Vite build output
  const distPath = path.resolve(import.meta.dirname, "../client");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // Fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
```

### Update Port Configuration in server/index.ts

Ensure your server listens on the port provided by Render's environment:

```typescript
const port = process.env.PORT || 5000;
server.listen({
  port,
  host: "0.0.0.0",
  reusePort: true,
}, () => {
  log(`serving on port ${port}`);
});
```

## Step 2: Set Up a Web Service on Render

1. Create a new account on [Render](https://render.com/) if you don't have one.
2. From your dashboard, click "New +" and select "Web Service".
3. Connect your GitHub repository.
4. Configure your service:
   - **Name**: nursing-exam-app (or your preferred name)
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan Type**: Select appropriate plan (Free tier is available)

## Step 3: Configure Environment Variables

Add the following environment variables in the Render dashboard:

- `NODE_ENV`: `production`

If your app uses a database, add:
- `DATABASE_URL`: Your database connection string

## Step 4: Deploy Your App

1. Click "Create Web Service"
2. Render will automatically deploy your application
3. Once deployment is complete, Render will provide a URL (like `https://nursing-exam-app.onrender.com`)

## Step 5: Verify Your Deployment

1. Visit your Render URL
2. Test the application's functionality
3. Check the Render logs if you encounter any issues

## Additional Configuration

### Setting Up PostgreSQL on Render (if needed)

1. From your Render dashboard, click "New +" and select "PostgreSQL"
2. Configure your database settings
3. Connect your Web Service to the database using the provided internal connection string

### Continuous Deployment

Render automatically deploys when you push changes to your main branch. You can configure deployment settings in your service settings.

## Troubleshooting

- **Static Files Not Found**: Ensure build paths are correct
- **Server Not Starting**: Check logs for errors
- **Database Connection Issues**: Verify connection strings
- **Environment Variable Problems**: Double-check environment variables in the Render dashboard

## Important Notes

- Render's free tier has limitations and may sleep after periods of inactivity
- Consider upgrading to a paid plan for production deployments
- Set up health checks for better monitoring
- Consider adding custom domains for a professional appearance