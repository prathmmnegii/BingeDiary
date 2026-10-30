# BingeDiary — EJS Frontend

This folder replaces the React/Vite frontend with an Express + EJS frontend. The existing `BingeDiary-Backend` API is kept separate and should remain unchanged.

## Requirements
- Node.js 18+
- The existing BingeDiary backend running on port `8000`
- MongoDB configured for the backend

## Run the backend
Open a terminal in `BingeDiary-Backend` and use your existing environment configuration:

```bash
npm install
npm run dev
```

The backend should respond at `http://localhost:8000/api/health`.

## Run the EJS frontend
Open a second terminal in `BingeDiary-EJS-Frontend`:

```bash
npm install
npm start
```

Open `http://localhost:3000`.

Optional: copy `.env.example` to `.env` and adjust `PORT` or `API_URL` if needed. By default, the frontend calls `http://localhost:8000/api`.

## Pages included
- Login and registration
- Dashboard and movie statistics
- Movie collection with search, delete, mark-watched, and watchlist actions
- Add movie form with genre, year, rating, poster URL, and watched checkbox
- Watchlist
- Watch history with delete action

## Notes
- The browser stores the JWT in `localStorage`, matching the existing React frontend's authentication flow.
- The backend's API routes, controllers, models, and database logic are not rewritten by this frontend migration.
- The original React frontend is retained in the project as a backup. Use `BingeDiary-EJS-Frontend` to run the EJS UI.
