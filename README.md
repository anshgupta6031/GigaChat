# GigaChat - Real-time Chat Application

GigaChat is a modern real-time chat application built with MERN stack (MongoDB, Express, React, Node.js) and Socket.IO for instant messaging.

## Features

- **User Authentication**: Secure signup and login system
- **Real-time Messaging**: Instant message delivery using Socket.IO
- **Profile Management**: Edit profile information and upload profile pictures
- **User Settings**: Customize your application experience
- **Responsive Design**: Works on both desktop and mobile devices

## Tech Stack

### Frontend
- React 19
- React Router v7
- Tailwind CSS & DaisyUI
- Zustand for state management 
- Socket.IO client for real-time communication
- Vite as build tool

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Socket.IO for WebSocket connections
- JWT for authentication
- Cloudinary for image uploads
- bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js (v18 or later recommended)
- MongoDB database

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/GigaChat.git
   cd GigaChat
   ```

2. Install backend dependencies
   ```bash
   cd backend
   npm install
   ```

3. Configure environment variables
   - Create or modify `.env` file in backend directory with your configuration:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Install frontend dependencies
   ```bash
   cd ../frontend
   npm install
   ```

5. Start the development servers
   - For backend:
   ```bash
   cd backend
   npm run dev
   ```
   - For frontend:
   ```bash
   cd frontend
   npm run dev
   ```

6. Access the app at `http://localhost:5173`

## Project Structure

```
GigaChat/
├── backend/                # Node.js & Express server
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── lib/            # Utilities and configurations
│   │   └── index.js        # Entry point
│   └── package.json
│
└── frontend/               # React application
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── pages/          # Application pages
    │   ├── store/          # Zustand state management
    │   ├── lib/            # Utilities and helpers
    │   └── App.jsx         # Main component
    └── package.json
```

## License

This project is licensed under the ISC License.

## Acknowledgements

- This project was created as a learning exercise for MERN stack and WebSocket communication. 