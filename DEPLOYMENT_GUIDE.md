# Deployment Guide for DataPulse AI

Your project is configured for deployment on **Render**.

## Step 1: Deploy on Render
Since your code is already on GitHub at `https://github.com/Dev121105/DataPulseAI`, you just need to connect it to Render.

1. Go to the [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** and select **Blueprint**.
3. Connect your GitHub account and select your repository **DataPulseAI**.
4. Render will automatically detect the `render.yaml` file.
5. You will be prompted to enter Environment Variables:
   - `GROQ_API_KEY`: Enter your Groq API key (starts with `gsk_...`).
6. Click **Apply**.

Render will now Build and Deploy both your Backend and Frontend.

## Troubleshooting
- **Build Fails?** Check the logs in the Render dashboard.
- **Frontend can't connect?** Ensure the `VITE_API_URL` environment variable was correctly picked up by the frontend service.
