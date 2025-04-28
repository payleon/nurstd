# Quick Render Deployment Steps

Below are the simplified steps to get your Nursing Exam application running on Render:

## Step 1: Export Your Project from Replit

1. Download your project as a ZIP file from Replit.
2. Create a new repository on GitHub or GitLab and upload your code.

## Step 2: Make Required Updates to package.json

```json
"scripts": {
  "dev": "NODE_ENV=development tsx server/index.ts",
  "build": "vite build && esbuild server/**/*.ts shared/**/*.ts --platform=node --packages=external --bundle --format=esm --outdir=dist/server",
  "start": "NODE_ENV=production node dist/server/index.js"
}
```

## Step 3: Deploy on Render

### Option 1: Using Render Blueprint (Easiest)

1. Log in to your Render dashboard
2. Go to "Blueprints" from the sidebar
3. Click "New Blueprint Instance"
4. Select your repository
5. Render will detect the `render.yaml` file already included in your project
6. Review and click "Apply"

### Option 2: Manual Service Setup

1. Log in to your Render dashboard
2. Click "New +" and select "Web Service"
3. Connect your repository
4. Fill in these details:
   - **Name**: nursing-exam-app
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add the environment variable:
   - `NODE_ENV`: `production`
6. Click "Create Web Service"

## Step 4: Verify Deployment

1. After the deploy completes, click the generated URL to view your application
2. Test core functionality to make sure everything is working
3. Check Render logs if you encounter any issues

## Getting Help

If you encounter any deployment problems, refer to the more detailed guide at `docs/DEPLOYMENT.md`.