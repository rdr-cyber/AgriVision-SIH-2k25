# Deployment Guide for AgriVision

This guide will help you deploy the AgriVision application to Vercel for free 24/7 hosting.

## Prerequisites

1. A GitHub account
2. A Vercel account (can be created with GitHub)

## Step 1: Push Your Code to GitHub

1. Create a new repository on GitHub (public or private)
2. Push your local code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/your-repo-name.git
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Import your GitHub repository
5. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: Leave as is
   - Build and Output Settings:
     - Build Command: `npm run build`
     - Output Directory: `.next`
6. Click "Deploy"

## Step 3: Environment Variables (if needed)

If your application uses environment variables:
1. In the Vercel dashboard, go to your project
2. Click "Settings" → "Environment Variables"
3. Add any required environment variables

## Step 4: Redeployment

After making changes to your code:
1. Push changes to GitHub
2. Vercel will automatically redeploy your application

## Notes

- The application will be available at a URL like: `https://your-project-name.vercel.app`
- Vercel's free tier includes:
  - Unlimited deployments
  - 100GB bandwidth per month
  - 500 serverless function invocations per day
- Custom domains can be added for free

## Troubleshooting

If you encounter issues during deployment:
1. Check the build logs in the Vercel dashboard
2. Ensure all dependencies are in package.json
3. Make sure there are no build errors in your code

Your AgriVision application is now ready for 24/7 access!