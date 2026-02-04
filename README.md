# Security Agency

## Project Overview
Complete Page for a security agency with in-memory authentication system.

- **Backend:** Java 21+ with Spring Boot
- **Frontend:** ReactJS + CSS Modules
- **Authentication:** In-Memory

## Project Structure

```
security-agency-backend/
├── src/main/java/com/securityagency/
│   ├── SecurityAgencyApplication.java
│   ├── controller/
│   │   └── AuthController.java
│   ├── model/
│   │   ├── User.java
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   ├── ResetPasswordRequest.java
│   │   └── AuthResponse.java
│   └── service/
│       └── UserService.java
├── src/main/resources/
│   └── application.properties
└── pom.xml

security-agency-frontend/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── authAPI.jsx
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ResetPassword.jsx
│   │   └── Dashboard.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── styles/
│   │   ├── global.css
│   │   ├── Login.module.css
│   │   ├── Register.module.css
│   │   ├── ResetPassword.module.css
│   │   └── Dashboard.module.css
│   ├── App.jsx
│   └── index.jsx
└── package.json
```

## Features

### 1. Authentication System
- **Login:** Email & password with failed attempt tracking
- **Registration:** Full validation with password strength requirements
- **Password Reset:** Available after account lockdown
- **Account Lockout:** After 3 failed login attempts

### 2. Validation Rules
- **Name Fields:** Min 3 chars, letters only (Polish characters supported)
- **Email:** RFC 5322 format validation
- **Password:** Min 8 chars, uppercase letter, digit, special character (!@#$%^&*)

### 3. Design System
- **Color Palette:**
  - Primary: Deep Navy Blue (#101D2C)
  - Secondary: Anthracite/Black (#1A1A1B)
  - Accent: Slate Gray (#3E4E56)
- **Components:** Custom inputs with icons, rounded corners, subtle shadows
- **Styling:** Professional security agency aesthetic

### 4. API Endpoints
```
GET  /api/health                 - Health check
POST /api/register               - User registration
POST /api/login                  - User authentication
PUT  /api/reset-password         - Password reset
```

## Setup Instructions

### Introduction Setup

1. Ensure Java 21+ and Maven are installed:
```bash
java -version
mvn -version
node -v
npm -v
```

### Backend + Frontend Setup

1. Navigate to frontend directory:
```bash
cd security-agency-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Back to main folder
```bash
cd ..
```

4. Install dependencies:
```bash
npm install
```

5. Start development server:
```bash
npm run dev
```

Backend will run on `http://localhost:8080`
Frontend will open at `http://localhost:3000`

## Testing the Application

### Test Account Setup (Manual)
1. Go to `http://localhost:3000/register`
2. Create a test account with valid credentials
3. Login with the created account
4. View the dashboard
5. Test password reset by failing 3 login attempts

### Example Test User
- First Name: John
- Last Name: Doe
- Email: john@example.com
- Password: SecurePass123!

## Technical Details

### Backend (Java 21+ + Spring Boot)
- **Framework:** Spring Boot 3.2.1
- **Java Version:** 21+
- **Dependencies:**
  - Spring Web
  - Lombok
  - Spring Boot DevTools
- **Data Storage:** In-memory Map structure
- **Password Hashing:** Simple hash (Java hashCode) - upgrade to BCrypt for production

### Frontend (ReactJS)
- **React Version:** 18.2.0
- **Routing:** React Router v6
- **State Management:** Context API + useState
- **HTTP Client:** Axios
- **Styling:** CSS Modules
- **CORS:** Enabled for local development

## Security Notes

⚠️ **Production Considerations:**
- Replace simple password hashing with BCrypt
- Implement JWT token-based authentication
- Add HTTPS/SSL certificates
- Implement database persistence
- Add rate limiting for login attempts
- Use environment variables for configuration
- Implement proper session management
- Add input sanitization and SQL injection prevention

## Development Notes

- CORS is configured to allow requests from `http://localhost:3000`
- Backend runs on port 8080
- Frontend runs on port 3000
- In-memory data is lost on backend restart
