# Quick Start Guide

Your Document QA System is now configured with your API keys! 🚀

## Your Configuration

✅ **Gemini API Key**: AIzaSyBnFn9dnDyLBEH2kO6ObDWne0-QD5MQsbA  
✅ **Firebase Project**: cosc-4aec4  
✅ **Firebase Auth Domain**: cosc-4aec4.firebaseapp.com  

## Setup Steps

### 1. Set up Environment Variables
```bash
# Copy your configuration to .env file
node setup-env.js
```

### 2. Install Dependencies
```bash
# Install all dependencies
npm run install:all
```

### 3. Start ChromaDB (Vector Database)
```bash
# Install ChromaDB
pip install chromadb

# Start ChromaDB server
chroma run --host localhost --port 8000
```

### 4. Start the Application
```bash
# Start both frontend and backend
npm run dev
```

## Access Your Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **ChromaDB**: http://localhost:8000

## What You Can Do Now

1. **Sign Up/Login**: Create an account using email and password
2. **Choose Domain**: Select from 5 specialized domains:
   - 📘 Educational
   - ⚖️ Legal  
   - 🩺 Healthcare
   - 💼 Business
   - 🌐 General
3. **Upload Documents**: Upload PDF, DOCX, or TXT files
4. **Chat with AI**: Ask questions about your documents
5. **View Sources**: See which parts of documents the AI used

## Firebase Setup Required

You'll need to enable Authentication in your Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **cosc-4aec4**
3. Go to **Authentication** → **Sign-in method**
4. Enable **Email/Password** authentication
5. Add your domain to authorized domains

## Troubleshooting

### If Authentication Fails
- Check Firebase Console has Email/Password enabled
- Verify the domain is added to authorized domains
- Check browser console for errors

### If ChromaDB Fails
- Make sure ChromaDB is running on port 8000
- Check the CHROMA_URL in your .env file

### If Gemini API Fails
- Verify your API key is correct
- Check if you have sufficient quota
- Ensure the API key has necessary permissions

## Next Steps

1. **Test the system**: Upload a document and ask questions
2. **Customize domains**: Modify prompt templates in `backend/utils/geminiClient.js`
3. **Add features**: Extend functionality as needed
4. **Deploy**: Use Docker or deploy to your preferred platform

## Support

If you encounter any issues:
1. Check the console logs
2. Verify all services are running
3. Check your API keys are correct
4. Open an issue in the repository

Happy coding! 🎉
