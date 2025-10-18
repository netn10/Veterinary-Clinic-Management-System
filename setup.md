# Quick Setup Guide

## Environment Variables
Create `server/.env`:
```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=veterinary_clinic
DB_USER=postgres
DB_PASSWORD=your_postgres_password
NODE_ENV=development
```

## Database Setup
1. Install PostgreSQL
2. Create database: `CREATE DATABASE veterinary_clinic;`
3. Update `.env` with your PostgreSQL credentials
4. Run: `cd server && npm run init-db`

## Installation
```bash
npm run install-all
npm run dev
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
