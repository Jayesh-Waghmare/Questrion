# AI File Reader

A web application that allows users to upload PDF files and chat with them using AI-powered vector search and similarity matching.

## Features

- **PDF Upload**: Upload PDF files (max 10MB)
- **Vector Embeddings**: Create embeddings using OpenAI's text-embedding-3-small
- **Vector Search**: Search for relevant content using Qdrant vector database
- **AI Chat**: Chat with PDFs using gemini-2.0-flash
- **Context Persistence**: Maintain chat context across page refreshes

## Architecture

### Backend (Python/FastAPI)
- `main.py`: FastAPI server with endpoints
- `indexing.py`: PDF processing and vector embedding creation
- `chat.py`: Chat functionality with vector similarity search

### Frontend (React)
- Modern UI with chat interface
- PDF upload functionality
- Real-time chat with loading states

## Prerequisites

1. **Python 3.8+**
2. **Node.js 16+**
3. **Qdrant Vector Database**
4. **OpenAI API Key**

## Setup

### 1. Backend Setup

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create .env file
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
```

### 2. Start Qdrant Vector Database

```bash
# Using Docker
docker run -p 6333:6333 qdrant/qdrant

# Or download from: https://qdrant.tech/documentation/guides/installation/
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Start Backend

```bash
cd backend

# Run the FastAPI server
python main.py
# or
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## Usage

1. Open your browser and go to `http://localhost:5173` (or the port shown by Vite)
2. Upload a PDF file
3. Start chatting with the PDF content
4. The system will use vector similarity search to find relevant content and generate AI responses

## API Endpoints

- `POST /api/ai/pdf` - Upload and process PDF
- `POST /api/ai/chat` - Chat with PDF content

## Environment Variables

Create a `.env` file in the backend directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## Troubleshooting

1. **Qdrant Connection Error**: Ensure Qdrant is running on localhost:6333
2. **OpenAI API Error**: Check your API key and billing
3. **PDF Processing Error**: Ensure PDF is not corrupted and under 5MB

## Development

The backend uses:
- FastAPI for the web server
- LangChain for PDF processing
- OpenAI for embeddings and chat
- Qdrant for vector storage

The frontend uses:
- React with Vite
- Axios for API calls
- React Hot Toast for notifications
- Tailwind CSS for styling 
