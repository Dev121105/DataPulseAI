# Deployment Guide for DataPulse AI

Your project is now configured for deployment on **Render**. Render is a cloud platform that makes it easy to host both your Python backend and React frontend.

## Prerequisites
- A [GitHub](https://github.com/) account.
- A [Render](https://render.com/) account.

## Step 1: Push Code to GitHub
If you haven't already, push your project to a new GitHub repository:

1. Create a new repository on GitHub (e.g., `datapulse-ai`).
2. Run these commands in your project terminal:
   ```bash
   git init
   git add .
   git commit -m "Prepare for deployment"
   git branch -M main
   git remote add origin https://github.com/<YOUR-USERNAME>/datapulse-ai.git
   git push -u origin main
   ```

## Step 2: Deploy on Render
1. Go to the [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** and select **Blueprint**.
3. Connect your GitHub account and select the `datapulse-ai` repository.
4. Render will automatically detect the `render.yaml` file.
5. You will be prompted to enter Environment Variables:
   - `GROQ_API_KEY`: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
6. Click **Apply**.

Render will now Build and Deploy both your Backend and Frontend.

- The **backend** will take a few minutes to build.
- The **frontend** will build after the backend (or concurrently).
- Once finished, you will get a public URL for your frontend (e.g., `https://datapulse-frontend.onrender.com`).

## Troubleshooting
- **Build Fails?** Check the logs in the Render dashboard.
- **Frontend can't connect?** Ensure the `VITE_API_URL` environment variable was correctly picked up by the frontend service (it handles this automatically in the Blueprint, but good to verify).
