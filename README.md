<<<<<<< HEAD
# plant-care-app
=======
# Plant Care Reminder Reminder App

A complete full-stack web application designed to help users manage their plants and receive visual reminders when they need watering.

## Tech Stack
- **Frontend**: React (Vite) + Tailwind CSS + React Router v6 + context/state
- **Backend**: Node.js + Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT-based authentication
- **Styling**: Tailwind CSS with custom premium UI

## Features
- Secure JWT-based Registration/Login
- Dashboard showing all registered plants and total stats
- Automatic visual reminders with color-coded alerts based on watering frequency
- CRUD Operations: Add, Edit, Delete, View Plant Details
- Premium aesthetic utilizing modern visual design languages (shadows, rounded cards, icons by Lucide)

## Project Layout (Folder Structure)

```
/Plant-Care
├── README.md               # You are here
├── client                  # Frontend (Vite + React)
│   ├── package.json
│   ├── vite.config.js
│   ├── src
│   │   ├── index.css       # Tailwind config
│   │   ├── App.jsx         # Routing & Main App Container
│   │   ├── context         # AuthContext
│   │   ├── services        # api.js (Axios)
│   │   ├── utils           # dateUtils.js (Calculations logic)
│   │   ├── components      # Navbar.jsx, PlantCard.jsx
│   │   └── pages           # Login, Register, Dashboard, Add/Edit Plant
├── server                  # Backend (Node + Express)
│   ├── package.json
│   ├── server.js           # Server Entry Point
│   ├── .env.example        # Env vars example
│   ├── config
│   │   └── db.js           # Mongoose setup
│   ├── models              # User, Plant Mongoose schemas
│   ├── controllers         # Route logic
│   ├── routes              # Express routers
│   └── middleware          # authMiddleware (JWT Verification)
```

## Setup Instructions

### 1. MongoDB Setup
Make sure you have MongoDB installed and running locally, or have an Atlas cluster URI. 
The application will use `mongodb://localhost:27017/plant_care_app` as the default link.

### 2. Backend Setup
1. Open a terminal and navigate to the `server` directory.
2. Run `npm install` to ensure all dependencies are resolved.
3. Create a `.env` file in the `server` root based on `.env.example`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/plant_care_app
   JWT_SECRET=super_secret_jwt_key_here
   ```
4. Start the backend server:
   ```bash
   npm run dev    # or npm start
   ```
The backend should now run at `http://localhost:5000`.

### 3. Frontend Setup
1. Open a new terminal and navigate to the `client` directory.
2. Run `npm install` to install React and Tailwind dependencies.
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
The frontend should now run at `http://localhost:5173`.

## How to use Locally
- Open your browser to `http://localhost:5173`.
- Create a new account by hitting "Register".
- Once registered, you are greeted with your (empty) dashboard.
- Press "Add New Plant" to insert a new plant, providing the watering frequency and when you last watered it.
- Your dashboard will automatically calculate when you next need to water it. If the date is past or today, an alert badge tells you it needs water.
- Click "Water Now" from the card to update the `lastWateredDate` to today!

## Deployment

### Backend Deployment (e.g., Render, Railway, Heroku)
1. Add a start script to your `server/package.json`: `"start": "node server.js"`.
2. Push your code to GitHub.
3. Connect the repository to your host (e.g., Render Web Service).
4. Point the Web Service root to `./server` or deploy only the server sub-folder.
5. Provide your configuration Environment Variables (`MONGO_URI`, `JWT_SECRET`, `PORT`).

### Frontend Deployment (e.g., Vercel, Netlify)
1. Since the client is built with Vite, configure your build command to `npm run build` and publish directory to `dist`.
2. Before deploying, ensure `api.js` points to your production backend URL instead of `localhost:5000`.
3. Link your Git repository on Vercel/Netlify.
4. Deploy the `client` directory!

Enjoy nurturing your plants! 🪴
>>>>>>> 75634d2 (first commit)
