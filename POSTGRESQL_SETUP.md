# PostgreSQL Setup Guide

## Installation

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

### Linux (Ubuntu/Debian)
```bash
sudo apt update
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

2. **Environment variables:**
Create `.env` file:
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=veterinary_clinic
DB_PASSWORD=your_postgres_password
DB_PORT=5432
```

3. **Initialize database:**
```bash
cd server
npm run init-db
```

## Verification

```bash
# Check connection
cd server && npm start
# Should see "Connected to PostgreSQL database"

# Verify tables
psql -U postgres -d veterinary_clinic
\dt
# Should show: animals, events
```

## Troubleshooting

**Connection Issues:**
- Ensure PostgreSQL service is running
- Check port 5432 is available
- Verify credentials in `.env` file
- Test: `psql -U postgres -h localhost`

**Permission Issues:**
- Check user has proper permissions
- Verify database exists
- Test user connection

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_USER` | postgres | Database username |
| `DB_HOST` | localhost | Database host |
| `DB_NAME` | veterinary_clinic | Database name |
| `DB_PASSWORD` | password | Database password |
| `DB_PORT` | 5432 | Database port |

## Next Steps
1. Run application: `npm run dev`
2. Test API endpoints
3. Add sample data through web interface
