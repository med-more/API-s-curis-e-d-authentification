# 🔐 404.js Centralized Authentication Backend (MERN Stack)

A secure, modular, and reusable **authentication backend** built with the MERN stack. This project serves as a solid foundation for multiple frontend applications (web or mobile) requiring centralized user management and supports **three types of authentication**: Basic Auth, Session, and JWT.

---

## 🚀 Features

- ✅ **RESTful API** structure (`/register`, `/login`, `/logout`, `/me`)
- 🔐 **Three authentication methods**:
  - Basic Authentication (via `Authorization` header)
  - Session-based Authentication (`express-session`)
  - JWT Authentication (access tokens + middleware)
- ✅ **Secure password hashing** with `bcrypt`
- ✅ **User input validation** with `express-validator`
- ⚠️ **Error handling middleware** returning standardized JSON responses
- 🌍 **CORS configuration** with origin/method/header control
- 🧱 **Modular architecture**: routes, controllers, middlewares, models
- 📦 Built with **Express.js**, **MongoDB**, and **Mongoose**

---

## 🏗️ Project Structure

```bash
.
├── config/
│   └── db.js                # MongoDB connection
├── controllers/
│   └── authController.js    # Register, login, logout, getMe
├── middlewares/
│   ├── authJWT.js           # JWT auth middleware
│   ├── authBasic.js         # Basic auth middleware
│   ├── authSession.js       # Session auth middleware
│   └── errorHandler.js      # Global error handler
├── models/
│   └── User.js              # Mongoose user schema
├── routes/
│   └── authRoutes.js        # Routes for authentication
├── validators/
│   └── authValidator.js     # Request validators
├── .env                     # Environment variables
├── server.js                # Entry point
└── package.json

---

## 📦 Installation
# 1. Clone the repository

git clone https://github.com/med-more/API-s-curis-e-d-authentification.git
cd API-s-curis-e-d-authentification

# 2. Install dependencies
npm install

# 3. Create a .env file
PORT=5000
MONGO_URI=mongodb://localhost:27017/authdb
JWT_SECRET=your_jwt_secret_key
SESSION_SECRET=your_session_secret
CORS_ORIGIN=http://localhost:3000


## 🧰 Scripts
npm start        # Start server
npm run dev      # Start with nodemon

##📘 UML Diagrams




