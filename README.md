# BEL Project — Admin Portal & Keycloak IAM Integration

An enterprise-grade Admin Dashboard and User Management Portal built with React, Node.js/Express, and Keycloak IAM. This portal provides role-based access control (RBAC), live user metrics, and session management.

---
## Dummy Admin
* Email: Admin@gmail.com
* Password: admin@12345

---

## Tech Stack

* Frontend: React, React Router v6, Tailwind CSS, Recharts, React Icons, Axios
* Backend: Node.js, Express.js
* Identity & Access Management (IAM): Keycloak (OpenID Connect / OAuth2)
* API Requests: Axios with JWT Authorization Headers

---

## Features

* Secure Keycloak Authentication: Direct Access Grant token authentication via Keycloak's OpenID Connect `/token` endpoint.
* Protected Routes: URL-manipulation defense using React Router wrapper components.
* Live Keycloak Metrics Dashboard: Real-time metrics for total users, admins, roles, and user distribution (powered by Recharts).
* Role-Based Access Control (RBAC): Admin privilege checks mapped directly from Keycloak realm roles.
* User & Admin Management: CRUD operations for users, admins, and realm roles.

---

## Project Structure

BEL PROJECT/
├── backend/            # Express.js API server & Keycloak Admin Client configuration
│   ├── config/         # Keycloak Admin Connection setup
│   ├── controllers/    # User, Admin, Role & Dashboard controllers
│   ├── routes/         # Express API routes
│   └── server.js       # Backend entry point
├── frontend/           # React SPA application
│   ├── src/
│   │   ├── components/ # Reusable UI (SidePanel, ProtectedRoute, etc.)
│   │   ├── pages/      # Dashboard, Users, Admins, Roles, SignIn
│   │   └── App.jsx
│   └── package.json
├── .gitignore          # Central root gitignore
└── README.md           # Project documentation

---

## Environment Variables Setup

### 1. Backend Environment (`backend/.env`)
Create a `.env` file inside the `backend` folder:

PORT=5000
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=your-realm-name
KEYCLOAK_CLIENT_ID=your-client-id
KEYCLOAK_CLIENT_SECRET=your-client-secret
KEYCLOAK_ADMIN_USER=login username of keycloak
KEYCLOAK_ADMIN_PASSWORD=your keycloak login password

### 2. Frontend Environment (`frontend/.env`)
Create a `.env` file inside the `frontend` folder:

VITE_API_BASE_URL=http://localhost:5000/api/v1

---

## Keycloak Configuration Checklist

Ensure your Keycloak instance has the following settings enabled:
1. Direct Access Grants: Enabled on your Client under Capability config.
2. Admin Role Mapping: Assign the `admin` realm role to your admin users.
3. Valid Redirect URIs: Add your frontend client URL (e.g., http://localhost:5173/*).

---

## Getting Started

### Prerequisites
* Node.js (v18 or higher)
* Keycloak Server running locally or remotely

### Installation

1. Clone the repository:
   git clone https://github.com/your-username/bel-project.git
   cd bel-project

2. Setup Backend:
   cd backend
   npm install
   npm start

3. Setup Frontend:
   Open a new terminal window:
   cd frontend
   npm install
   npm run dev

4. Open your browser and navigate to http://localhost:5173 to log in!
