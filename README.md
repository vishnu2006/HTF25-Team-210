# Document-Based Question Answering System

A full-stack web application that allows users to upload documents (PDF, DOCX, or text) and ask questions about their contents using AI-based document understanding.

## Features

- 🔐 **Authentication**: Firebase Auth integration for secure user management
- 📄 **Multi-format Support**: Upload PDF, DOCX, and TXT files
- 🧠 **AI-Powered**: Uses Gemini API for intelligent responses
- 🎯 **Multi-Domain**: 5 specialized domains (Educational, Legal, Healthcare, Business, General)
- 🔍 **Vector Search**: ChromaDB for efficient document retrieval
- 💬 **Chat Interface**: ChatGPT-style conversation interface
- 📚 **Document History**: Track and manage uploaded documents

## Tech Stack

### Frontend
- **Next.js 14** with App Router
- **React 18** with TypeScript
- **TailwindCSS** for styling
- **Firebase Auth** for authentication
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **ChromaDB** for vector storage
- **Gemini API** for AI responses
- **Multer** for file uploads
- **PDF-parse, Mammoth** for document extraction

## Quick Start

### Prerequisites
- Node.js 18+ 
- Firebase project
- Gemini API key
- ChromaDB (optional, will use local instance)

### Installation

1. **Clone and install dependencies:**
```bash
npm run install:all
```

2. **Set up environment variables:**
```bash
cp env.example .env
# Edit .env with your API keys
```

3. **Start ChromaDB (if using local instance):**
```bash
# Install ChromaDB
pip install chromadb
# Start ChromaDB server
chroma run --host localhost --port 8000
```

4. **Start the development servers:**
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Project Structure

```
document-qa-system/
├── frontend/                 # Next.js frontend
│   ├── app/
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   └── chat/           # Chat interface pages
│   └── package.json
├── backend/                 # Node.js backend
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   └── server.js           # Main server file
└── package.json            # Root package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Document Management
- `POST /api/upload` - Upload documents
- `GET /api/documents/:userId` - Get user documents
- `DELETE /api/documents/:documentId` - Delete document

### Chat
- `POST /api/chat` - Send message and get AI response

## Domain-Specific Features

### Educational 📘
- Simplified explanations
- Clear term definitions
- Step-by-step learning approach

### Legal ⚖️
- Strict document-based responses
- No assumptions beyond document text
- Professional legal information

### Healthcare 🩺
- Informational insights only
- Medical disclaimers
- Professional consultation recommendations

### Business 💼
- Key insights and trends
- Strategic analysis
- Actionable business information

### General 🌐
- Conversational responses
- Flexible information delivery
- General-purpose assistance

## Development

### Frontend Development
```bash
cd frontend
npm run dev
```

### Backend Development
```bash
cd backend
npm run dev
```

### Building for Production
```bash
npm run build
```

## Environment Variables

Create a `.env` file in the root directory with:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please open an issue in the repository.

---

**Powered by Gemini API and Vector Intelligence**
