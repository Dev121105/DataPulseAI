# Deployment Guide for DataPulse AI (Streamlit)

Your application has been converted to **Streamlit** for easier hosting.

## Step 1: Push Code to GitHub
Open your terminal and run:
```bash
git add .
git commit -m "Convert to Streamlit"
git push origin main
```

## Step 2: Deploy on Streamlit Cloud
1. Go to [share.streamlit.io](https://share.streamlit.io/).
2. Click **New app**.
3. Select your repository: **DataPulseAI**.
4. Set the **Main file path** to `streamlit_app.py`.
5. Click **Deploy!**.

## Step 3: Configure Secrets
Once deployed, the app will need your API Key.
1. In your app's dashboard, click **Manage app** (bottom right) -> **Settings** (three dots).
2. Go to **Secrets**.
3. Add your key like this:
   ```toml
   GROQ_API_KEY = "gsk_..."
   ```
4. Save.

## Running Locally
To test it on your machine:
```bash
pip install -r requirements.txt
streamlit run streamlit_app.py
```
