# 🐾 Nati's Clinic Management System

A full-stack web application for veterinary clinics to manage animal patients and their medical records.

## Features

- **Animal Management** - CRUD operations for animal records (name, species, birth date, age)
- **Event Recording** - Log visits, treatments, and observations with date tracking
- **Excel Export** - Generate detailed reports with animal info and all events
- **Responsive Design** - Modern Vue.js frontend with intuitive user experience

## Tech Stack

**Frontend:** Vue.js 3, Pinia, Vue Router, Axios, Vite  
**Backend:** Node.js, Express.js, PostgreSQL, ExcelJS  
**Database:** PostgreSQL with animals and events tables (1:N relationship)

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- PostgreSQL database

### Setup
1. **Clone and install**:
   ```bash
   git clone <repository-url>
   cd travelfactory_home_assignment
   npm run install-all
   ```

2. **Configure database**:
   ```bash
   cp .env_example .env
   # Edit .env with your PostgreSQL credentials
   ```

3. **Initialize database**:
   ```bash
   cd server && npm run init-db && cd ..
   ```

4. **Start application**:
   ```bash
   npm run dev
   ```

5. **Access**:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

### Environment Variables
Copy `.env_example` to `.env` and configure:
- `DB_USER`, `DB_HOST`, `DB_NAME`, `DB_PASSWORD`, `DB_PORT`
- Default values work for local development

## 📚 API Endpoints

**Animals:**
- `GET /api/animals` - List all animals
- `POST /api/animals` - Add animal `{ name, species, birth_date }`
- `GET /api/animals/:id` - Get animal details with events
- `PUT /api/animals/:id` - Update animal
- `DELETE /api/animals/:id` - Delete animal (cascade deletes events)

**Events:**
- `POST /api/animals/:id/events` - Add event `{ type, description, event_date }`
- `DELETE /api/animals/:animalId/events/:eventId` - Delete event

**Export:**
- `GET /api/animals/:id/export` - Download Excel report

## 🎯 Key Features

- **Full CRUD** for animals and events
- **Excel Export** with detailed reports
- **Data Validation** (birth date cannot be future)
- **Responsive Design** for all devices
- **Toast Notifications** for user feedback
- **Modal Forms** for editing and confirmations

## 🛠️ Development Commands

```bash
npm run install-all    # Install all dependencies
npm run dev           # Start both frontend and backend
npm run build         # Build for production
npm start            # Start production server
```

## 📁 Project Structure

```
├── client/          # Vue.js frontend
├── server/          # Node.js backend  
├── data/           # PostgreSQL database
└── package.json    # Root configuration
```

## 🧪 Testing

1. Add animals with the "Add Animal" button
2. Edit animal details via "Edit Animal" 
3. View details and add events
4. Export Excel reports
5. Delete records (with confirmation)

## 🔍 Known Limitations & Trade-offs

This section outlines current limitations and the design decisions behind them:

### Scalability & Production Readiness
- **PostgreSQL Database**
  - **Current**: Production-ready PostgreSQL database with connection pooling
  - **Limitation**: Not ideal for high-concurrency production environments
  - **Migration Path**: Database abstraction layer allows easy migration to PostgreSQL/MySQL
  - **Use Case**: Perfect for small clinics (<1000 animals) or development/demo purposes

### Security & Access Control
- **No Authentication System**
  - **Current**: Open access to all features without user login
  - **Limitation**: No user accounts, roles, or permissions
  - **Consideration**: Intentional trade-off for assessment project scope
  - **Production Need**: Would require JWT/session-based auth, role-based access control (RBAC)

### User Experience Features
- **No Search or Filtering**
  - **Current**: Animals displayed as a simple list
  - **Limitation**: Difficult to find specific animals in large datasets
  - **Workaround**: Use browser's Ctrl+F for basic text search
  - **Enhancement**: Full-text search, filters by species/date, sorting options needed

- **No Image Uploads**
  - **Current**: Text-based animal records only
  - **Limitation**: Cannot attach photos of animals
  - **Technical Requirement**: Would need file upload middleware (multer), storage solution (cloud/local), and image optimization

### Data Validation & Error Handling
- **Client-Side Validation**
  - **Current**: Basic HTML5 validation (required fields, date formats)
  - **Note**: Comprehensive server-side validation is implemented for security
  - **Enhancement**: Could add more sophisticated client-side validation (Vue Vuelidate/VeeValidate)

### Additional Considerations
- **No Automated Tests**: No unit tests, integration tests, or E2E tests implemented
- **No Pagination**: All animals loaded at once (could cause performance issues with 1000+ records)
- **No Real-time Updates**: Changes don't auto-refresh for other users (no WebSocket/polling)
- **No Audit Trail**: No logging of who made changes and when
- **No Data Backup**: No automated backup system for the PostgreSQL database
- **No Email Notifications**: No automated reminders for appointments or follow-ups

## 🚀 Future Enhancements

**High Priority:**
- Authentication & user roles
- Search and filtering
- Enhanced reporting with analytics

**Medium Priority:**
- File uploads (photos, documents)
- Automated testing suite
- Database optimization

**Low Priority:**
- Appointment scheduling
- Owner management
- Mobile app

## 📞 Support

For technical issues or questions about the implementation, please contact me at **Email:** netn10@gmail.com.

Please refer to the code comments and API documentation within the project files for additional technical details.
