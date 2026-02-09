# How to Set Up Google Authentication

To make the "Sign in with Google" button work, you need a **Google Client ID**. Follow these steps:

## 1. Get a Google Client ID
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project (e.g., "DCC Budget Manager").
3.  Go to **APIs & Services** > **Credentials**.
4.  Click **Create Credentials** > **OAuth client ID**.
5.  Select **Web application**.
6.  Add Authorized JavaScript origins:
    -   `http://localhost:3000` (Frontend)
    -   `http://localhost:3002` (Backend)
7.  Click **Create**.
8.  Copy the **Client ID** (it looks like `123456789-xxxx.apps.googleusercontent.com`).

## 2. Update Your Code
You need to paste this Client ID in two places:

### Backend (`.env` file)
Create or update your `.env` file in the root directory:
```env
GOOGLE_CLIENT_ID=your-copied-client-id
```

### Frontend (`src/index.tsx`)
In `src/index.tsx`, locate the `GoogleOAuthProvider` and replace the placeholder:
```tsx
<GoogleOAuthProvider clientId="your-copied-client-id">
```

## 3. Restart the System
After updating the configuration:
1.  Restart the backend server.
2.  Restart the frontend (if needed).

The Google Login should now work!
