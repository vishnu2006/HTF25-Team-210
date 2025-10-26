# Installation Guide

This guide will help you set up the Document QA System on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)

## Quick Setup (Automated)

1. **Clone the repository:**
```bash
git clone <repository-url>
cd document-qa-system
```

2. **Run the setup script:**
```bash
node setup.js
```

3. **Configure environment variables:**
```bash
# Edit the .env file with your API keys
nano .env
```

4. **Start the development servers:**
```bash
npm run dev
```

## Manual Setup

If you prefer to set up manually or the automated script fails:

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp env.example .env
```

Edit the `.env` file with your API keys:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Backend Configuration
PORT=5000
FRONTEND_URL=http://localhost:3000

# AI Configuration
GEMINI_API_KEY=your_gemini_api_key

# Vector Database
CHROMA_URL=http://localhost:8000
```

### 3. Set Up External Services

#### Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable Authentication with Email/Password
4. Get your Firebase configuration from Project Settings
5. Add the configuration to your `.env` file

#### Gemini API Setup
1. Go to [Google AI Studio](https://makersuite.google.com/)
2. Create a new API key
3. Add the API key to your `.env` file

#### ChromaDB Setup (Optional)
ChromaDB will be automatically started if you use Docker, or you can install it locally:

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

# Or start them separately:
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

## Docker Setup (Alternative)

If you prefer using Docker:

```bash
# Start all services with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Verification

After setup, you should be able to:

1. **Access the frontend:** http://localhost:3000
2. **Access the backend API:** http://localhost:5000/api/health
3. **Sign up/Login** with email and password
4. **Upload documents** (PDF, DOCX, TXT)
5. **Chat with your documents** using the AI assistant

## Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Kill processes using ports 3000 and 5000
npx kill-port 3000 5000
```

#### 2. Firebase Authentication Not Working
- Check your Firebase configuration in `.env`
- Ensure Authentication is enabled in Firebase Console
- Verify the domain is added to authorized domains

#### 3. Gemini API Errors
- Verify your API key is correct
- Check if you have sufficient quota
- Ensure the API key has the necessary permissions

#### 4. ChromaDB Connection Issues
- Make sure ChromaDB is running on port 8000
- Check the CHROMA_URL in your `.env` file
- Try restarting ChromaDB

#### 5. File Upload Issues
- Check file size limits (10MB max)
- Ensure file types are supported (PDF, DOCX, TXT)
- Verify backend is running and accessible

### Logs and Debugging

#### Frontend Logs
```bash
cd frontend
npm run dev
# Check browser console for errors
```

#### Backend Logs
```bash
cd backend
npm run dev
# Check terminal output for errors
```

#### ChromaDB Logs
```bash
# If running ChromaDB locally
chroma run --host localhost --port 8000 --log-level DEBUG
```

## Development

### Project Structure
```
document-qa-system/
├── frontend/                 # Next.js frontend
│   ├── app/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   └── api/             # API routes
│   └── package.json
├── backend/                 # Node.js backend
│   ├── routes/              # API routes
│   ├── utils/               # Utility functions
│   └── server.js            # Main server file
└── package.json             # Root package.json
```

### Available Scripts

```bash
# Development
npm run dev                  # Start both frontend and backend
npm run dev:frontend         # Start frontend only
npm run dev:backend         # Start backend only

# Production
npm run build               # Build frontend for production
npm start                   # Start production server

# Installation
npm run install:all         # Install all dependencies
```

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the logs for error messages
3. Ensure all prerequisites are installed
4. Verify your API keys are correct
5. Open an issue in the repository

## Next Steps

After successful installation:

1. **Test the application:** Upload a document and ask questions
2. **Customize domains:** Modify prompt templates in `backend/utils/geminiClient.js`
3. **Add features:** Extend the functionality as needed
4. **Deploy:** Use Docker or deploy to your preferred platform

Happy coding! 🚀
