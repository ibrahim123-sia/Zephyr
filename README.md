# Zephyr

Full-stack web application with a Node.js/Express backend and a React (Vite) frontend.

## Project Structure

```
backend/    Express API server (MongoDB via Mongoose, JWT auth, Cloudinary uploads)
frontend/   React app (Vite, Redux Toolkit, Tailwind CSS)
```

## Getting Started

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

Both `backend/` and `frontend/` require their own `.env` file (not committed to version control). Create one in each directory based on the variables used in the respective codebase.
