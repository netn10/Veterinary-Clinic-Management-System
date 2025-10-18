# Development Guidelines

## Code Quality Standards
- **ESLint**: Vue.js rules for client, Node.js rules for server
- **Structure**: Clear separation between frontend, backend, database
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Validation**: Both client-side and server-side validation

## Project Structure
```
client/          # Vue.js frontend
├── src/
│   ├── components/     # Reusable UI components
│   ├── views/          # Page components
│   ├── stores/         # Pinia state management
│   └── router/         # Vue Router configuration

server/          # Node.js backend
├── routes/            # API route handlers
├── config/            # Database configuration
└── scripts/           # Database initialization
```

## Development Commands
```bash
# Code quality
cd client && npm run lint
cd server && npm run lint

# Development
npm run dev           # Start both client and server
npm run client        # Start only client
npm run server        # Start only server
npm run build         # Build for production
```

## Best Practices

### Error Handling
- Use try-catch blocks for async operations
- Provide meaningful error messages
- Log errors for debugging
- Use consistent error response format

### Data Validation
- Validate input on both client and server
- Use appropriate HTTP status codes
- Sanitize user input to prevent injection attacks
- Implement proper date validation

### State Management
- Use Pinia stores for global state
- Keep component state local when possible
- Implement proper loading and error states
- Use computed properties for derived state

### API Design
- Follow RESTful conventions
- Use appropriate HTTP methods (GET, POST, PUT, DELETE)
- Implement proper pagination
- Return consistent response formats

### Database Operations
- Use parameterized queries to prevent SQL injection
- Implement proper connection pooling
- Handle database errors gracefully
- Use transactions for complex operations

### Security
- Never expose sensitive information in client code
- Use environment variables for configuration
- Implement proper CORS settings
- Validate all user inputs

## Code Review Checklist
- [ ] Code follows ESLint rules
- [ ] Error handling is implemented
- [ ] Input validation is present
- [ ] Security best practices are followed
- [ ] Performance considerations are addressed
- [ ] Code is testable and maintainable

## Performance Guidelines
- **Frontend**: Lazy loading, caching, bundle optimization
- **Backend**: Connection pooling, database indexes, query optimization

## Testing Strategy
- **Unit Tests**: Individual functions and methods
- **Integration Tests**: API endpoints and database operations
- **E2E Tests**: Complete user journeys and cross-browser compatibility

## Environment Configuration
- Use environment variables for configuration
- Never commit sensitive data
- Use different configurations for different environments
- Implement proper logging

## Security Considerations
- Encrypt sensitive data
- Implement proper access controls
- Use HTTPS in production
- Validate all user inputs
- Implement rate limiting
