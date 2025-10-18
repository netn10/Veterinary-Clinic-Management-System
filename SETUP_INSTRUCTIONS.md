# 🐾 Veterinary Clinic Management System - Setup Instructions

## Prerequisites

### 1. Install PostgreSQL
You need to install PostgreSQL first. Here are the options:

#### Option A: Download PostgreSQL (Recommended)
1. Go to https://www.postgresql.org/download/windows/
2. Download PostgreSQL installer for Windows
3. Run the installer and follow the setup wizard
4. Remember the password you set for the 'postgres' user
5. Make sure PostgreSQL service is running

#### Option B: Use Docker (Alternative)
```bash
docker run --name postgres-vet -e POSTGRES_PASSWORD=password -e POSTGRES_DB=veterinary_clinic -p 5432:5432 -d postgres:13
```

### 2. Create Database
Once PostgreSQL is installed and running:

```sql
-- Connect to PostgreSQL and run:
CREATE DATABASE veterinary_clinic;
```

## Setup Steps

### Step 1: Dependencies (✅ Already Done)
```bash
npm run install-all
```

### Step 2: Environment Configuration (✅ Already Done)
The environment file has been created at `server/.env`. 
Update the database password if needed:
```
DB_PASSWORD=your_actual_postgres_password
```

### Step 3: Initialize Database
```bash
cd server
npm run init-db
```

### Step 4: Start Development Servers
```bash
# From project root
npm run dev
```

This will start:
- Backend API: http://localhost:3001
- Frontend App: http://localhost:3000

## Quick Start (If PostgreSQL is Ready)

If you have PostgreSQL running, you can start immediately:

```bash
# 1. Initialize database
cd server
npm run init-db

# 2. Start both servers
cd ..
npm run dev
```

## Troubleshooting

### PostgreSQL Connection Issues
- Make sure PostgreSQL service is running
- Check if port 5432 is available
- Verify database credentials in `server/.env`

### Port Already in Use
- Change ports in `server/.env` and `client/vite.config.js`
- Kill existing processes using those ports

### Database Errors
- Ensure the database `veterinary_clinic` exists
- Check PostgreSQL logs for connection issues

## Application Features

Once running, you can:
- ✅ View list of animals
- ✅ Add new animals
- ✅ View animal details and events
- ✅ Add events (Visit, Treatment, Observation)
- ✅ Export Excel reports
- ✅ Responsive design for mobile/desktop

## Next Steps

1. **Install PostgreSQL** (if not already done)
2. **Create the database** `veterinary_clinic`
3. **Run database initialization**: `cd server && npm run init-db`
4. **Start the application**: `npm run dev`
5. **Open browser**: http://localhost:3000

The application will be fully functional once PostgreSQL is set up!
