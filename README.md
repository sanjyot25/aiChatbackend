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

### Frontend Setup

1. Navigate to the frontend directory
   ```
   cd frontend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the frontend
   ```
   npm start
   ```

4. Open http://localhost:3000 in your browser

## API Endpoints

### Models

- GET `/api/models` - Get all models
- GET `/api/models/:id` - Get a single model
- POST `/api/models` - Create a new model
- PATCH `/api/models/:id` - Update a model
- DELETE `/api/models/:id` - Delete a model

### Plugins

- GET `/api/plugins` - Get all plugins
- GET `/api/plugins/:id` - Get a single plugin
- POST `/api/plugins` - Create a new plugin
- PATCH `/api/plugins/:id` - Update a plugin
- DELETE `/api/plugins/:id` - Delete a plugin

### Conversations

- GET `/api/conversations` - Get all conversations
- GET `/api/conversations/:id` - Get a single conversation with its messages
- POST `/api/conversations` - Create a new conversation
- PATCH `/api/conversations/:id` - Update a conversation
- DELETE `/api/conversations/:id` - Delete a conversation and its messages

### Messages

- GET `/api/messages/conversation/:conversationId` - Get all messages for a conversation
- POST `/api/messages` - Create a new message (with automatic AI response if user message)
- DELETE `/api/messages/:id` - Delete a message

### Chat (Legacy)

- POST `/api/chat` - Send a message and receive a response

## Technologies Used

### Backend
- Express.js
- MongoDB with Mongoose
- Node.js

### Frontend
- React
- React Router
- Axios
- TailwindCSS 