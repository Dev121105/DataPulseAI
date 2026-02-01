# 🚀 Deployment Guide for DataPulse AI

This guide will help you deploy the **DataPulse AI** application as a full web app:
- **Backend**: FastAPI on Render
- **Frontend**: React on Vercel (or Netlify/Render)

---

## 1. Prerequisites

- A GitHub account.
- Accounts on [Render](https://render.com/) and [Vercel](https://vercel.com/).
- Your project pushed to a GitHub repository.

---

## 2. Backend Deployment (Render)

We will use the `render.yaml` file included in the project to deploy the backend.

1.  **Log in to Render**.
2.  Click **New +** -> **Blueprints**.
3.  Connect your GitHub repository.
4.  Render will detect the `render.yaml` file.
5.  **Environment Variables**:
    - `GROQ_API_KEY`: You will be prompted to enter this. Use the same key you use locally.
6.  Click **Apply**. Render will deploy your backend.
7.  **Copy the Backend URL**: Once deployed, you will see a URL like `https://datapulse-backend.onrender.com`. **Copy this URL**, you will need it for the frontend.

> **Note on Database**: This project uses SQLite (`mini_data.db`). On Render's free tier, the filesystem is ephemeral, meaning the database will reset if the server restarts. For persistent data, consider upgrading to a Render Disk or using an external database like PostgreSQL.

---

## 3. Frontend Deployment (Vercel)

1.  **Log in to Vercel**.
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Configure Project**:
    - **Framework Preset**: Vite
    - **Root Directory**: `frontend` (Click "Edit" and select the `frontend` folder).
5.  **Environment Variables**:
    - Expand the "Environment Variables" section.
    - Add a new variable:
        - **Key**: `VITE_API_URL`
        - **Value**: Your Render Backend URL (e.g., `https://datapulse-backend.onrender.com`). **Important**: Do not include a trailing slash.
6.  Click **Deploy**.

---

## 4. Verification

1.  Open your Vercel deployment URL.
2.  Try uploading a CSV file.
3.  Ensure the file processes and you can chat with it.
4.  If you see network errors, check the browser console (F12) and ensure the `VITE_API_URL` is correct and the backend is running.

---

## Troubleshooting

- **CORS Errors**: If you see CORS issues, ensure your Backend URL in Vercel is correct (https vs http). The backend is configured to allow all origins (`*`) by default.
- **Backend Health**: Visit `https://your-backend.onrender.com/` in your browser. You should see `{"status": "online", ...}`.
