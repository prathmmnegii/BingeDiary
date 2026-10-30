# 🎬 BingeDiary

**BingeDiary** is a personal movie tracking application that helps users organize their movie-watching journey. Users can maintain a movie collection, track watched movies, manage their watchlist, and keep a history of their viewing activity.

The project uses a Node.js and Express backend with MongoDB for data storage, and an EJS-based frontend for rendering the user interface.

## ✨ Features

- **User Authentication:** Secure user registration and login using JWT and password hashing with bcrypt.
- **Dashboard:** View your movie collection and watching statistics.
- **Movie Management:** Add, view, update, and delete movies.
- **Watch Tracking:** Mark movies as watched and maintain a watch history.
- **Watchlist:** Add movies to your watchlist and manage your future viewing plans.
- **Movie Details:** Store information such as title, genre, release year, rating, and poster URL.
- **Protected Routes:** Secure API endpoints using JWT authentication.

## 🛠️ Tech Stack

### Frontend
- EJS (Embedded JavaScript Templates)
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js
- REST API
- JWT Authentication
- bcrypt

### Database
- MongoDB
- Mongoose
- MongoDB Compass

## 📁 Project Structure

```text
BingeDiary/
│
├── BingeDiary-Backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── connection.js
│   ├── server.js
│   └── package.json
│
├── BingeDiary-EJS-Frontend/
│   ├── public/
│   │   ├── css/
│   │   └── js/
│   ├── views/
│   │   ├── pages/
│   │   └── partials/
│   ├── server.js
│   └── package.json
│
└── BingeDiary-Frontend/
    └── Original React + Vite frontend
```

## ⚙️ Installation & Setup

### Prerequisites

Make sure you have the following installed:

- Node.js (18 or above)
- npm
- MongoDB Community Server
- MongoDB Compass
- Git

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
cd BingeDiary
```

### 2. Configure MongoDB

Make sure your MongoDB Server is installed and running locally.

You can use MongoDB Compass to connect to:

```text
mongodb://127.0.0.1:27017
```

The application uses a database named `bingediary`, which MongoDB creates automatically when data is first inserted.

### 3. Configure the Backend

Navigate to the backend directory:

```bash
cd BingeDiary-Backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=8001
MONGO_URI=mongodb://127.0.0.1:27017/bingediary
JWT_SECRET=your_secret_key
```

Start the backend:

```bash
npm run dev
```

The backend API will run at:

```text
http://localhost:8001
```

API health check:

```text
http://localhost:8001/api/health
```

### 4. Configure the EJS Frontend

Open a second terminal and navigate to:

```bash
cd BingeDiary-EJS-Frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=3000
API_URL=http://127.0.0.1:8001/api
```

Start the frontend:

```bash
npm start
```

Open the application in your browser:

```text
http://localhost:3000
```

## 🔌 API Overview

The backend provides REST API endpoints for:

| Route | Description |
|---|---|
| `/api/users` | User authentication and profile |
| `/api/movies` | Movie management |
| `/api/watches` | Watch history management |
| `/api/watchlist` | Watchlist management |
| `/api/health` | API health check |

## 🔐 Authentication

- Passwords are hashed using bcrypt before storage.
- JWT tokens are used for user authentication.
- Protected API routes require valid authentication tokens.
- The EJS frontend stores the authentication token in browser localStorage.

## 🚀 Running the Project

Both servers must run simultaneously:

| Component | Local URL | Port |
|---|---|---|
| EJS Frontend | http://localhost:3000 | 3000 |
| Backend API | http://localhost:8001 | 8001 |
| MongoDB | localhost:27017 | 27017 |

## 👨‍💻 Author

**Pratham Negi**

B.Tech Computer Science Engineering

DIT University

---

⭐ If you find this project interesting, consider giving the repository a star!