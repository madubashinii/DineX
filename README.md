# DineX - Restaurant Management App

A full-stack restaurant web application built with **React**, **Node.js**, **Express**, and **MongoDB**.  
It allows customers to view menu items, make reservations, place orders, and manage their profile. Admins can manage menu items, view reservations, and track orders.

## Features

### Customer Side
- User registration and login (JWT authentication)
- View menu items with categories
- Make reservations
- Place and track orders
- View and edit user profile
- Protected routes for customer-specific actions

### Admin Side
- Admin login
- CRUD operations for menu items
- View all reservations
- Access restricted to admin users via middleware

### Shared Features
- Responsive design (desktop + mobile)
- Smooth scrolling for home page sections
- Role-based authentication and authorization
- RESTful API backend

## Tech Stack

- **Frontend**: React, React Router DOM, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT, bcryptjs
- **Utilities**: express-async-handler

## Project Structure

```bash
DineX/
├── backend/
│ ├── controllers/
│ │ ├── auth.controller.js
│ │ ├── admin.controller.js
│ │ └── user.controller.js
│ ├── models/
│ │ ├── User.js
│ │ ├── MenuItem.js
│ │ ├── ReservationModel.js
│ │ └── OrderModel.js
│ ├── routes/
│ │ ├── auth.routes.js
│ │ ├── user.routes.js
│ │ └── admin.routes.js
│ ├── middleware/
│ │ ├── auth.middleware.js
│ │ └── admin.middleware.js
│ └── server.js
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── Header.jsx
│ │ │ └── Footer.jsx
│ │ ├── pages/
│ │ │ ├── Home.jsx
│ │ │ ├── Login.jsx
│ │ │ ├── Register.jsx
│ │ │ ├── MenuPage.jsx
│ │ │ ├── Cart.jsx
│ │ │ ├── Checkout.jsx
│ │ │ ├── Dashboard.jsx
│ │ │ └── Profile.jsx
│ │ ├── App.jsx
│ │ └── index.css
└── README.md
```

### Installation

**Backend:**
```bash
cd backend
npm install
```

1. **Create a .env file with:**
```bash
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRES_IN=30d
PORT=5000
```
2. **Start backend:**
```bash
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
npm start
```
### API Endpoints

```bash
POST /api/auth/register - Register user
POST /api/auth/login - Login user
GET /api/user/profile - Get logged-in user's profile 
GET /api/admin/menu - Get all menu items (admin)
POST /api/admin/menu - Create menu item (admin)
PUT /api/admin/menu/:id - Update menu item (admin)
DELETE /api/admin/menu/:id - Delete menu item (admin)
GET /api/admin/reservations - Get all reservations (admin)
```
</br>
<p align="center"> Made with ❤️ by Madubashini </p>
