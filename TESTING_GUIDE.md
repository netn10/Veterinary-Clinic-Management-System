# Testing Guide

## Manual Testing Checklist

### Animal Management (CRUD)
- [ ] **Create**: Add animal with valid data, verify success notification
- [ ] **Read**: View animals list, check pagination, view animal details
- [ ] **Update**: Edit animal information, verify changes reflected
- [ ] **Delete**: Delete animal with confirmation, verify removal

### Event Management
- [ ] **Add Event**: Create visit/treatment/observation, verify in list
- [ ] **Delete Event**: Remove event with confirmation, verify removal

### Excel Export
- [ ] **Export**: Download Excel report, verify animal info and events included

### Data Validation
- [ ] **Birth Date**: Try future dates, verify error messages
- [ ] **Required Fields**: Try empty forms, verify HTML5 validation
- [ ] **Event Types**: Try invalid types, verify error handling

### User Interface
- [ ] **Responsive**: Test desktop (1920x1080), tablet (768x1024), mobile (375x667)
- [ ] **Theme**: Toggle dark/light themes, verify persistence
- [ ] **Accessibility**: Keyboard navigation, ARIA labels, color contrast

### Error Handling
- [ ] **Network**: Disconnect internet, verify error messages, reconnect
- [ ] **Database**: Stop database, verify errors, restart and test

### Performance
- [ ] **Large Datasets**: Add 100+ animals, test pagination and load times
- [ ] **Concurrent Users**: Multiple browser tabs, simultaneous actions

## Automated Testing (Future)

### Test Commands
```bash
npm run test:unit        # Unit tests
npm run test:integration # Integration tests  
npm run test:e2e        # End-to-end tests
```

### Test Coverage Goals
- Unit Tests: 80%+ coverage
- Integration Tests: 70%+ coverage
- E2E Tests: Critical user journeys

## Test Data

### Sample Animals
```json
[
  {"name": "Buddy", "species": "Dog", "birth_date": "2020-01-15"},
  {"name": "Whiskers", "species": "Cat", "birth_date": "2019-06-20"},
  {"name": "Tweety", "species": "Bird", "birth_date": "2021-03-10"}
]
```

### Sample Events
```json
[
  {"type": "Visit", "description": "Annual checkup", "event_date": "2024-01-15"},
  {"type": "Treatment", "description": "Antibiotic treatment", "event_date": "2024-01-10"},
  {"type": "Observation", "description": "Behavioral changes", "event_date": "2024-01-05"}
]
```

## Browser Compatibility

### Supported Browsers
- Chrome 120+, Firefox 121+, Safari 17+, Edge 120+

### Performance Benchmarks
- Initial page load: < 2 seconds
- Navigation: < 1 second
- API responses: < 500ms
- Memory usage: < 100MB client, < 200MB server

## Security Testing

### Input Validation
- [ ] SQL injection attempts
- [ ] XSS attacks
- [ ] CSRF attacks
- [ ] Input sanitization verification

### Authentication (Future)
- [ ] Login/logout functionality
- [ ] Session management
- [ ] Password requirements

## Regression Testing

### Critical Paths
1. **Animal Management**: Create → Read → Update → Delete
2. **Event Management**: Add → View → Delete
3. **Export Flow**: Navigate → Export → Verify

### Edge Cases
- [ ] Empty database
- [ ] Single animal with no events
- [ ] Animal with many events
- [ ] Special characters in names/descriptions
- [ ] Very long descriptions
- [ ] Date boundaries (leap years)

## Bug Reporting Template

```
**Title**: Brief description

**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Expected Result**: What should happen
**Actual Result**: What actually happens

**Environment**: Browser, OS, Resolution
**Priority**: High/Medium/Low
```

## Test Environment Setup

### Development
```bash
npm run install-all
npm run dev
```

### Staging
```bash
npm run build
npm start
```

## Monitoring

### Application Monitoring
- [ ] API response times
- [ ] Database performance
- [ ] Error rates
- [ ] Critical issue alerts

### User Experience
- [ ] Page load times
- [ ] User interactions
- [ ] Accessibility metrics
