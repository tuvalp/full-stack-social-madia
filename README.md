# 🌐 Full Stack Social Media App

Live Demo: https://full-stack-social-madia.vercel.app/

A modern full-stack social media application built with **React (TypeScript)** on the frontend and **Node.js + Express** on the backend. The app allows users to register, log in, create posts with images, like posts, and view user profiles.

## 📁 Project Structure

```
social/
├── client/       # React frontend (TypeScript)
├── server/       # Node + Express backend
├── .gitignore
├── README.md
└── package.json  # Optional root to run both client & server
```

---

## ✨ Features

This full-stack social media app offers a rich set of features that simulate a real-world platform like Twitter or Facebook Lite:

### 👤 User Management

* **Register & Login:** Secure user authentication with email and password.
* **Session Persistence:** Remain logged in across sessions using cookies or local storage.
* **User Profile Pages:** View individual profiles and their posts.

### 📝 Posts

* **Create Posts:** Add text-based posts with optional images.
* **Edit & Delete:** Update or remove your own posts anytime.
* **Post Feed:** View posts from all users in a chronological feed.

### ❤️ Social Interactions

* **Like Posts:** Users can like any post (visual feedback included).
* **Comment System (optional):** (Planned or available) Users can leave comments and replies.

### 📷 Media Upload

* **Image Upload Support:** Users can upload images alongside text using `multer` (backend) and `FormData` (frontend).
* **Image Preview:** Uploaded images are previewed within the feed.

### 🔍 Navigation

* **React Router Integration:** Navigate between Home, Login, Register, Profile, etc.
* **Responsive Design:** Works well on both desktop and mobile.

### 🧰 Developer Features

* **RESTful API:** Clean and modular backend API built with Express.
* **MongoDB Atlas:** Cloud-hosted NoSQL database.
* **Environment Configuration:** Use `.env` files for secrets like DB URI and ports.
* **Error Handling:** Basic frontend and backend error handling.
* **Scalable Structure:** Project organized for maintainability and easy feature expansion.

---

## ⚙️ Installation

```bash
git clone https://github.com/YOUR_USERNAME/full-stack-social-madia.git
cd full-stack-social-madia
```

### 1. Backend (server)

```bash
cd server
npm install
npm start
```

Create a `.env` file in `server/` with:

```
PORT=5050
MONGO_URI=your_mongodb_atlas_uri
```

### 2. Frontend (client)

```bash
cd client
npm install
npm start
```

---

## 🌐 Deployment

You can deploy this project using platforms like:

* **Frontend**: Render, Netlify, Vercel
* **Backend**: Render, Railway, Fly.io

Ensure:

* Your backend server is publicly accessible.
* CORS is configured properly.
* React makes requests to the live API URL.

---

## 📄 License

This project is licensed under the MIT License.
