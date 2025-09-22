# Frontend - Elderly Home Management

Angular web application with Material Design and TailwindCSS for managing elderly home operations.


## 🏗️ Architecture Overview
```text
frontend/src//
├── app/
│ ├── components/ # Feature components
│ │ ├── patients-page/ # Patient management
│ │ ├── staff-page/ # Staff management
│ │ └── visitors-page/ # Visitor management
│ ├── shared/
│ │ ├── services/ # Data services
│ │ ├── interfaces/ # TypeScript interfaces
│ │ └── guards/ # Route protection
│ └── app.config.ts # Application configuration
└── assets/ # Static resources
```


## 📦 Technology Stack

- **Angular 20**: Modern Angular with Signals
- **Angular Material v20.2.1**: UI component library
- **TailwindCSS v4.1**: Utility-first CSS framework
- **RxJS v7.8**: Reactive programming
- **JWT Decode v4**: Token parsing


## 🎯 Features

### Authentication & Authorization
- JWT-based login/logout
- Google OAuth 2.0 integration
- Role-based UI components (ADMIN, EDITOR, READER)
- Route guards for protected routes

### Patient Management
- Complete CRUD operations
- Dynamic form validation
- Room/bed assignment with business logic validation
- Medical ailments management
- Emergency contact information
- Visitor association

### Staff Management  
- Staff member registration and management
- Role assignment
- Salary and employment information
- Secure password handling

### Visitor Management
- Visitor registration
- Patient-visitor relationship tracking
- Family/non-family classification


## 🚀 Development Server

### Install dependencies
```bash
npm install
```

### Start development server
```bash
ng serve
```

### Build for production
```bash
ng build
```

### Run tests
```bash
ng test
```

The application will be available at http://localhost:4200.


## 🔧 Project Configuration

### Angular Configuration
-  Standalone components (no NgModules)
-  Zoneless change detection
-  Strict TypeScript mode
-  Prettier code formatting

### Styling
-  TailwindCSS for utility classes
-  Angular Material for components
-  Custom theme in custom-theme.scss

## 📱 Key Components

### Pages
- PatientsPage: Main patient management interface
- StaffPage: Staff member management
- VisitorsPage: Visitor registration and tracking
- StaffLogin: Authentication page

### Reusable Components
- PatientsTable: Sortable patient data table
- PatientForm: Comprehensive patient form with validation
- PatientCard: Patient detail modal
- Navbar: Role-aware navigation


## 🔐 Authentication Flow
- Login: Username/password or Google OAuth2
- Token Storage: JWT stored in localStorage
- Role Detection: Token decoding for role-based UI
- Auto-logout: Token expiration handling


## 📊 Data Services

### PatientService
- Patient CRUD operations
- Visitor-patient association
- Real-time data with Signals

### StaffService
- Staff management
- Authentication logic
- Role-based permission checks

### VisitorService
- Visitor registration
- Patient visit tracking


## 🛡️ Route Guards

### AuthGuard
- Prevents access to unauthorized users
- Redirects to login page

### RoleGuard
- Restricts access based on user roles
- ADMIN-only content protection


## 🎨 UI/UX Features
- Responsive Design: Mobile-first approach
- Accessibility: ARIA labels and keyboard navigation
- Loading States: Progressive content loading
- Error Handling: User-friendly error messages
- Sorting & Filtering: Interactive data tables


## 🌐 API Integration
The frontend communicates with the backend REST API:
- Base URL: http://localhost:3000/api
- JWT authentication via Authorization header
- Error handling and response validation


## 🧪 Testing

# Unit tests
```bash
ng test
```

# End-to-end tests (if configured)
```bash
ng e2e
```


## 📦 Build & Deployment

# Production build
```bash
ng build --configuration production
```

# GitHub Pages deployment
```bash
ng deploy
```


## 🔄 State Management
- Angular Signals: Reactive state primitives
- Service-based: Centralized data management
- Component Communication: Input/Output decorators and services