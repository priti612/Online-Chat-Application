🧠 Overview

The Online Chat Application enables users to:

Register and log in securely

Chat with other users in real time

View online/offline status

Experience fast and reliable messaging

This project was developed as a learning + hackathon project, focusing on real-time communication, backend logic, and frontend integration.

✨ Features
🔐 Authentication

User registration

User login & logout

Secure password handling

💬 Chat Features

Real-time one-to-one messaging

Instant message delivery

Message timestamps

Auto-scroll to latest message

👥 User Experience

Clean and responsive UI

Online/offline user indicator

Error handling & loading states

🛠️ Developer Features

Modular code structure

Environment-based configuration

Scalable backend architecture

🧰 Tech Stack
Frontend

HTML / CSS / JavaScript

React (if applicable)

Axios (for API calls)

Backend

Node.js

Express.js

WebSocket / Socket.io (for real-time chat)

Database

MongoDB (Mongoose ORM)

Tools & Platforms

Git & GitHub

VS Code

Postman

🏗️ System Architecture
Client (Browser)
   ↓  REST / WebSocket
Backend Server (Node.js + Express)
   ↓
Database (MongoDB)


Frontend communicates with backend via REST APIs

Real-time messages are handled using WebSockets

MongoDB stores users and chat messages

🖼️ Screenshots

Screenshots will be added soon.

(You can add images here later)

⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/USERNAME/REPOSITORY_NAME.git
cd REPOSITORY_NAME

2️⃣ Install Dependencies
Backend
cd backend
npm install

Frontend
cd frontend
npm install

🔐 Environment Variables

Create a .env file in the backend folder and add:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret


⚠️ Do NOT upload .env to GitHub
Use .env.example instead

▶️ Running the Application
Start Backend Server
npm start

Start Frontend Server
npm start

Open in Browser
http://localhost:3000

📁 Folder Structure
online-chat-app/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── server.js
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│
├── .gitignore
├── README.md

🔌 API Endpoints
Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register user
POST	/api/auth/login	Login user
Chat
Method	Endpoint	Description
GET	/api/users	Get all users
GET	/api/messages/:id	Get chat messages
POST	/api/messages	Send message
🚀 Future Enhancements

Group chat support

File & image sharing

Read receipts

Typing indicators

Push notifications

End-to-end encryption

Voice & video calls
