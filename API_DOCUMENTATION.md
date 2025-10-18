# API Documentation

## Base URL
```
http://localhost:3001/api
```

## Response Format
**Success:** `{ "data": [...], "pagination": {...} }`  
**Error:** `{ "error": "Error message" }`

## HTTP Status Codes
- `200` - OK, `201` - Created, `400` - Bad Request, `404` - Not Found, `500` - Server Error

## Animals API

### GET /api/animals
List all animals with pagination  
**Query:** `?page=1&limit=10`

### POST /api/animals
Create new animal  
**Body:** `{ "name": "Buddy", "species": "Dog", "birth_date": "2020-01-15" }`  
**Validation:** All fields required, birth_date cannot be future

### GET /api/animals/:id
Get animal details with events  
**Query:** `?page=1&limit=10` for events pagination

### PUT /api/animals/:id
Update animal  
**Body:** `{ "name": "Updated", "species": "Dog", "birth_date": "2020-01-15" }`

### DELETE /api/animals/:id
Delete animal and all events

### GET /api/animals/:id/export
Download Excel report

## Events API

### POST /api/animals/:id/events
Add event for animal  
**Body:** `{ "type": "Visit", "description": "Checkup", "event_date": "2024-01-15" }`  
**Types:** Visit, Treatment, Observation

### DELETE /api/animals/:animalId/events/:eventId
Delete specific event

## Database Schema
```sql
-- Animals table
CREATE TABLE animals (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  birth_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table  
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  animal_id INTEGER NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('Visit', 'Treatment', 'Observation')),
  description TEXT NOT NULL,
  event_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Testing with curl
```bash
# Get animals
curl -X GET "http://localhost:3001/api/animals"

# Create animal
curl -X POST "http://localhost:3001/api/animals" \
  -H "Content-Type: application/json" \
  -d '{"name":"Buddy","species":"Dog","birth_date":"2020-01-15"}'

# Export Excel
curl -X GET "http://localhost:3001/api/animals/1/export" -o "report.xlsx"
```

## Environment Variables
```env
PORT=3001
DB_USER=postgres
DB_HOST=localhost
DB_NAME=veterinary_clinic
DB_PASSWORD=password
DB_PORT=5432
```
