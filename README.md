# Book Space

Book Space is a full-stack reading app built for an exam project. Users can browse books, search and filter the collection, save books to their profile, and write reviews.

## Features

- User signup, login, logout, and cookie-based session handling
- Search books by title, author, or genre
- Filter books by genre
- View book details and similar book recommendations
- Save books to a personal profile
- Read and write reviews

## Tech Stack

- React Router 7
- React 19
- Express
- MongoDB Atlas
- Mongoose
- bcryptjs

## Project Structure

- `app/` contains the frontend routes and styles
- `server/` contains the Express API, Mongoose models, and seed scripts

## Getting Started

### 1. Install dependencies

Frontend:

```bash
npm install
```

Backend:

```bash
cd server
npm install
```

### 2. Environment variables

Create a `.env` file inside `server/` with:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5001
```

### 3. Seed the database

Books:

```bash
cd server
node seedBooks.js
```

Reviews:

```bash
cd server
node seedReviews.js
```

### 4. Run the app

Start backend:

```bash
cd server
npm run dev
```

Start frontend:

```bash
npm run dev -- --host 127.0.0.1
```

Frontend runs on:

`http://127.0.0.1:5173`

Backend runs on:

`http://localhost:5001`
