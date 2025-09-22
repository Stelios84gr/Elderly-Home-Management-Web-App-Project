# Backend API - Hyacinth Elderly Care Facility

RESTful API built with Node.js >=19.2.0 <20.0.0, Express v5.x and MongoDB for managing elderly home operations.


## 🏗️ Architecture Overview
```text
backend/
├── controllers/ # Business logic handlers
├── models/ # MongoDB schemas and validation
├── routes/ # Express route definitions
├── services/ # Business logic and data operations
├── middlewares/ # Auth, validation, error handling
├── logger/ # Winston logging configuration
└── tests/ # Jest test suites
```

## 📦 Dependencies

### Core Dependencies
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT authentication
- **bcrypt**: Password hashing
- **google-auth-library**: OAuth 2.0 integration

### Development
- **jest**: Testing framework
- **supertest**: HTTP assertion testing (not used extensively)


## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Staff login
- `GET /api/auth/google/callback` - Google OAuth 2.0 callback

### Patients Management
- `GET /api/patients` - List all patients
- `POST /api/patients` - Create new patient (ADMIN only)
- `GET /api/patients/:username` - Get patient by username
- `PATCH /api/patients/:username` - Update patient (ADMIN only)
- `DELETE /api/patients/:username` - Delete patient (ADMIN only)
- `PATCH /api/patients/addVisitor` - Add visitor to patient
- `PATCH /api/patients/removeVisitor` - Remove visitor from patient

### Staff Management
- `GET /api/staff` - List all staff members
- `POST /api/staff` - Create new staff (ADMIN only)
- `GET /api/staff/:username` - Get staff by username
- `PATCH /api/staff/:username` - Update staff (ADMIN only)
- `DELETE /api/staff/:username` - Delete staff (ADMIN only)

### Visitors Management
- `GET /api/visitors` - List all visitors
- `POST /api/visitors` - Create new visitor (ADMIN only)
- `GET /api/visitors/:username` - Get visitor by username
- `PATCH /api/visitors/:username` - Update visitor (ADMIN only)
- `DELETE /api/visitors/:username` - Delete visitor (ADMIN only)


## 🔐 Authentication & Authorization

### JWT Token Flow
1. Login with username/password or Google OAuth 2.0
2. Receive JWT token with user roles
3. Include token in Authorization header: `Bearer <token>`
4. Middleware validates token and role permissions

### Role-Based Access Control
- **ADMIN**: Full access to all operations
- **EDITOR**: Read and update permissions
- **READER**: Read-only access


## 🗄️ Data Models

Patient Schema
```javascript
{
  username: String, // Auto-generated: 1{lastInitial}{firstName}{lastNameLength}
  firstName: String,
  lastName: String,
  AMKA: String, // Greek Social Security Number (11 digits)
  roomData: { roomNumber: String, bedNumber: String },
  patientAilments: [{ disease: String, severity: Number }],
  emergencyContactInfo: Object,
  visitors: Array
}
```
Staff Schema
```javascript
{
  username: String, // Auto-generated: 3{lastInitial}{firstName}{lastNameLength}
  password: String, // Hashed with bcrypt
  roles: [String], // ['READER', 'EDITOR', 'ADMIN']
  occupation: String,
  monthlySalary: Number
}
```
Visitor Schema
```javascript
{
  username: String, // Auto-generated: 2{lastInitial}{firstName}{lastNameLength}
  patientToVisit: String, // Reference to patient username
  relationship: String,
  isFamily: Boolean
}
```


## 🧪 Testing

### Run all tests
```bash
   npm test
```

### Run tests with coverage
```bash
   npm test -- --coverage
```

### Run specific test file
```bash
   npm test -- tests/patient.test.js
```


## 📊 Logging

Winston logger configured with:
- Console output
- Daily rotating file logs (7-day retention)
- MongoDB error logging
- Structured JSON format


## 🔧 Environment Variables

| Variable              | Description                     | Required |
|-----------------------|---------------------------------|----------|
| MONGODB_URI           | MongoDB connection string       | Yes      |
| TOKEN_SECRET          | JWT signing secret              | Yes      |
| GOOGLE_CLIENT_ID      | Google OAuth2 client ID         | No       |
| GOOGLE_CLIENT_SECRET  | Google OAuth2 client secret     | No       |
| REDIRECT_URI          | OAuth2 callback URL             | No       |


## 🚀 Deployment

### Production build
```bash
   npm start
```

### Development with auto-reload
```bash
   npm run dev
```
   
The API will be available at http://localhost:3000 with Swagger docs at /api-docs.