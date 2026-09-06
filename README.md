# Personnel Wellness — Commander Dashboard

A runnable demo of the Commander Dashboard shown in the supplied reference image.

## Stack
- Frontend: React + Vite + plain CSS + Lucide icons
- Backend: Node.js + Express
- Persistence: JSON file for demo purposes (easy to replace with PostgreSQL)

## Run it

### 1) Backend
```bash
cd server
npm install
npm run dev
```
Backend: http://localhost:5000

### 2) Frontend (new terminal)
```bash
cd client
npm install
npm run dev
```
Frontend: http://localhost:5173

Open the frontend URL in your browser.

## API
- `GET /api/health`
- `GET /api/commander/dashboard`
- `GET /api/commander/units/:name`
- `POST /api/commander/refresh`

## Notes for the SIH project
The commander dashboard intentionally exposes only unit-level aggregated information. It does not display individual personnel names or individual risk scores. The backend stores dashboard data separately so the frontend is not the source of truth.
