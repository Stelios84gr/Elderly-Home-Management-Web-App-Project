# Hyacinth Elderly Care Facility Management Web App

A full-stack monorepo project for managing patients, staff and visitors in Hyacinth, an elderly care facility. The system provides role-based authentication, comprehensive CRUD operations and Google OAuth2 integration.


## 🏗️ Architecture

- **Backend**: Node.js >=v19.2.0 <20.0.0, Express v5.x, MongoDB, Mongoose v8.x, JWT 4.x, Google OAuth2, Winston logger 3.x
- **Frontend**: Angular v20.x, Angular Material v20.x, TailwindCSS v4.x
- **Authentication**: JWT-based with role-based access control (READER, EDITOR, ADMIN)


## 📁 Project Structure
```text
elderly-home-web-app-project/
├── backend/ # Node.js + Express REST API
│   ├── controllers/      # Route handlers
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   ├── services/         # Business logic
│   ├── middlewares/      # Authentication & authorization
│   └── tests/            # Jest test suites
└── frontend/ # Angular web application
    ├── src/app/components/   # UI components
    ├── src/app/shared/       # Services, interfaces, guards
    └── src/environments/     # Configuration
```


## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.x
- MongoDB (local or MongoDB Atlas)
- Angular CLI (`npm install -g @angular/cli`)

### Installation & Setup

1. **Clone the repository**
    ```bash
   git clone https://github.com/Stelios84gr/Elderly-Home-Management-Web-App-Project.git
   cd Elderly-Home-Management-Web-App-Project

2. **Back-end Setup**
    ```bash
   cd backend
   npm install
   npm run dev

3. **Front-end Setup**
    ```bash
   cd frontend
   npm install
   ng serve

4. **Access the application**
- Front-end: http://localhost:4200
- Backend API: http://localhost:3000
- API Documentation: http://localhost:3000/api-docs

## 👥 Default Roles & Permissions
- ADMIN: Full CRUD access to all entities
- EDITOR: Read and update permissions
- EADER: Read-only access

## 📚 API Documentation
Interactive Swagger documentation available at /api-docs when the backend is running.

🧪 Testing
```bash
# Backend tests
cd backend
npm test
```


## 📖 Detailed Documentation
Provided is also documentation for both the back-end and front-end seperately:

[Back-end Documentation](https://github.com/Stelios84gr/Elderly-Home-Management-Web-App-Project/blob/main/backend/README.md)

[Front-end Documentation](https://github.com/Stelios84gr/Elderly-Home-Management-Web-App-Project/blob/main/frontend/README.md)