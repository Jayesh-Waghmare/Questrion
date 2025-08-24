# QuestrionAI – AI-Powered Document Q&A Platform (Built with RAG)
QuestrionAI is a **Retrieval-Augmented Generation (RAG)** powered full-stack application that lets you **upload PDFs and chat with them**. It extracts content, generates **OpenAI embeddings**, stores them in **Qdrant**, and retrieves the most relevant chunks to ground LLM answers.  

The app is containerized with **Docker** and deployed on **AWS EC2** (backend) and **Vercel** (frontend), with **Clerk** for authentication.

## 🌐 Live URLs

- **Frontend**: https://questrion.vercel.app  
- **Backend**: https://questrionai.ddnsfree.com  

⚠️ **Note:** The backend must be running for the application to function properly. It handles document ingestion, embeddings, vector search, and AI responses.

## 🚀 Features

- **RAG-based Q&A** – Retrieval-Augmented Generation pipeline for grounded answers  
- **PDF Upload & Ingestion** – Extracts text, cleans it, chunks into passages, and embeds with OpenAI  
- **Chat with Documents** – Interactive Q&A over your uploaded content  
- **Vector Search (Qdrant)** – Similarity search to find the most relevant chunks  
- **Conversation Memory** – Maintains history and context across sessions  
- **Smart Suggestions** – AI-generated follow-up questions for smoother interaction  
- **Authentication** – Secure login/sign-up with Clerk  
- **Production Ready** – Dockerized services, deployed via Docker Compose on AWS EC2, frontend on Vercel

## 🛠️ Tech Stack

- **Frontend:** React + Vite, TypeScript  
- **Backend:** Python **FastAPI**, Uvicorn  
- **AI/RAG:** OpenAI Embeddings (`text-embedding-3-large`) + Retrieval pipeline  
- **Vector DB:** Qdrant  
- **Auth:** Clerk  
- **Infra:** Docker, Docker Compose, AWS EC2, Nginx reverse proxy  
- **Hosting:** Vercel (frontend), EC2 (backend)

## 📦 How It Works (RAG Pipeline)

1. **Upload PDF** → Extract + Clean → Chunk into passages  
2. **Embed** → Generate embeddings (OpenAI) → Store in Qdrant  
3. **Query** → Retrieve top-k relevant chunks → Build context prompt  
4. **Answer** → LLM generates grounded response using retrieved context  
