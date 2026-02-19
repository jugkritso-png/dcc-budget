# How to Set Up Google Authentication

To make the "Sign in with Google" button work, you need a **Google Client ID**. Follow these steps:

## 1. Get a Google Client ID
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project (e.g., "DCC Budget Manager").
3.  Go to **APIs & Services** > **Credentials**.
4.  Click **Create Credentials** > **OAuth client ID**.
5.  Select **Web application**.
6.  Add Authorized JavaScript origins:
    -   `http://localhost:3000` (Frontend Dev)
    -   `http://localhost:3002` (Backend)
    -   `https://your-production-domain.com` (Production)
7.  Click **Create**.
8.  Copy the **Client ID** (it looks like `123456789-xxxx.apps.googleusercontent.com`).

## 2. Update Your Code
You need to paste this Client ID in your `.env` file (or deployment environment variables).

### Backend & Frontend (`.env` file)
Create or update your `.env` file in the root directory. You need to verify the ID on the backend AND use it in the frontend.

```env
# For Backend Verification
GOOGLE_CLIENT_ID=your-copied-client-id

# For Frontend Button (Vite requires VITE_ prefix)
VITE_GOOGLE_CLIENT_ID=your-copied-client-id
```

## 3. Restart the System
After updating the `.env` file:
1.  Restart the backend server (`npm run server`).
2.  Restart the frontend dev server (`npm run dev`).

The Google Login should now work!
