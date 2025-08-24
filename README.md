# QuestrionAI – AI-Powered Document Q&A Platform
QuestrionAI is a full-stack AI application that lets you **upload PDFs and chat with them**. It chunks documents, creates **OpenAI embeddings**, stores them in **Qdrant**, and answers your questions with **context-aware retrieval**. The app is containerized with **Docker** and deployed on **AWS EC2** (backend) and **Vercel** (frontend), with **Clerk** for authentication.

## 🌐 Live URLs

- **Frontend**: https://questrion.vercel.app  
- **Backend**: https://questrionai.ddnsfree.com

⚠️ **Note:** The backend must be running for the application to function properly. It handles PDF ingestion, embeddings, vector search, and AI chat.

## 🚀 Features

- **PDF Upload & Ingestion** – Extracts text, cleans it, splits into chunks, and generates embeddings  
- **Chat with Documents** – Ask questions and get answers grounded in retrieved context  
- **Vector Search (RAG)** – Qdrant similarity search over embedded chunks  
- **Conversation History** – Persisted context across sessions  
- **Smart Suggestions** – Auto-suggest follow-ups after each answer  
- **Auth with Clerk** – Secure sign-in/sign-up and user scoping  
- **Dockerized Services** – Backend API and Vector DB run as containers  
- **Prod Deployments** – Backend on EC2 via Docker Compose; Frontend on Vercel

## 🛠️ Tech Stack

- **Frontend:** React + Vite, TypeScript  
- **Backend:** Python **FastAPI**, Uvicorn  
- **AI/RAG:** OpenAI Embeddings (`text-embedding-3-large`), Google Generative Language API compatibility  
- **Vector DB:** Qdrant  
- **Auth:** Clerk  
- **Infra:** Docker, Docker Compose, AWS EC2, Nginx reverse proxy  
- **Hosting:** Vercel (frontend), EC2 (backend)

## 📦 How It Works (High Level)

1. **Upload PDF** → Text extraction → Clean & chunk  
2. **Embed** chunks with OpenAI → Store vectors + metadata in Qdrant  
3. **Query** → Similarity search (top-k) → Build prompt with retrieved chunks  
4. **Answer** → LLM responds with grounded, citation-style snippets
