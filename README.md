# TypingMind Clone

This project is a clone of TypingMind, a chat interface for AI models. It consists of a backend (Express, MongoDB) and a frontend (React, TailwindCSS).

## Features

- CRUD operations for Models and Plugins
- Chat interface with model and plugin selection
- Conversation management with persistent storage
- Message history for each conversation
- Responsive design with TailwindCSS

## Project Structure

The project is divided into two main folders:

- `/backend`: Express.js API with MongoDB
- `/frontend`: React application

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas connection)

### Backend Setup

1. Navigate to the backend directory
   ```
   cd backend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example` with your MongoDB URI
   ```
   MONGODB_URI=mongodb://localhost:27017/typing-mind-clone
   PORT=5000
   ```

4. Seed the database with initial data
   ```
   npm run seed
   ```

5. Start the backend
   ```
   npm run dev
   ```

