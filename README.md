# CourseMap Integrated Project

This workspace contains the frontend and backend for the CourseMap application.

## Project Structure

- `kweb_coursemap`: Frontend (React + Vite)
- `curriculum-roadmap`: Backend (NestJS)

## How to Run

You need to run both the backend and frontend servers simultaneously.

### 1. Start the Backend

Open a terminal and navigate to the `curriculum-roadmap` directory:

```bash
cd curriculum-roadmap
npm install
npm run start:dev
```

The backend will start on `http://localhost:3000`.

### 2. Start the Frontend

Open a new terminal and navigate to the `kweb_coursemap` directory:

```bash
cd kweb_coursemap
npm install
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is busy).

## Integration Details

- The frontend is configured to communicate with the backend at `http://localhost:3000`.
- CORS is enabled on the backend to allow requests from the frontend.
- Authentication (Login/Signup) and Profile features are connected to the backend API.
- Course map data is currently hardcoded (as requested).
