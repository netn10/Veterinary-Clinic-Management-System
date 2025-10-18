# Quick Setup Guide

## Environment Variables

Create a file `server/.env` with the following content:

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
3. Update the `.env` file with your PostgreSQL credentials
4. Run: `cd server && npm run init-db`

## Installation

```bash
# Install all dependencies
npm run install-all

# Start development servers
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
