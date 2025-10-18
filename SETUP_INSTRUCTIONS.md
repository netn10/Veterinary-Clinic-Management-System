# Setup Instructions

## Prerequisites
- Node.js 16+
- PostgreSQL database

## PostgreSQL Installation

### Windows
1. Download from https://www.postgresql.org/download/windows/
2. Run installer and follow setup wizard
3. Remember the `postgres` user password
4. Ensure PostgreSQL service is running

### macOS
```bash
brew install postgresql
brew services start postgresql
```

### Linux
```bash
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## Database Setup

1. **Create database:**
```sql
psql -U postgres
CREATE DATABASE veterinary_clinic;
\q
```

2. **Update environment:**
Edit `server/.env` with your PostgreSQL password:
```env
DB_PASSWORD=your_actual_postgres_password
```

## Quick Start

```bash
# 1. Initialize database
cd server
npm run init-db

# 2. Start application
cd ..
npm run dev
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Troubleshooting

**PostgreSQL Issues:**
- Ensure PostgreSQL service is running
- Check port 5432 is available
- Verify credentials in `server/.env`

**Port Issues:**
- Change ports in `server/.env` and `client/vite.config.js`
- Kill existing processes using those ports

**Database Errors:**
- Ensure database `veterinary_clinic` exists
- Check PostgreSQL logs for connection issues

## Application Features
- ✅ View and manage animals
- ✅ Add/edit animal details
- ✅ Record events (Visit, Treatment, Observation)
- ✅ Export Excel reports
- ✅ Responsive design

## Next Steps
1. Install PostgreSQL
2. Create database `veterinary_clinic`
3. Run: `cd server && npm run init-db`
4. Start: `npm run dev`
5. Open: http://localhost:3000
