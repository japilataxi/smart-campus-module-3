# Smart Campus Web Application

## Overview

The Smart Campus Web Application is the primary user interface of the Smart Campus Module 3 platform.

It provides a modern web interface that allows students, librarians, and administrators to interact with the Smart Campus ecosystem through a single entry point.

The frontend **never communicates directly with business microservices**. All requests are routed through the API Gateway, which is responsible for authentication, authorization, and request forwarding.

---

# Architecture

```
User
   │
   ▼
Next.js Web Application
   │
   ▼
API Gateway
   │
   ├── Auth Service
   ├── Library Service
   ├── Notification Service
   ├── Campus Incident Service
   ├── QR Access Service
   ├── Transport Service
   └── Space Availability Service
```

---

# Port

```
3003
```

---

# Main Features

## Authentication

- User registration
- User login
- JWT authentication
- Session management
- User logout

---

## Dashboard

- Smart Campus overview
- Library statistics
- Connected microservices overview
- Current authenticated role

---

## User Profile

- View authenticated user information
- View institutional email
- View assigned roles
- View primary role

---

## Notifications

- View notifications
- Receive real-time notifications using WebSocket
- Notification history

---

## Library Service

### Catalog

- Search books
- View book information
- View authors
- View categories
- Check available copies

### Loans

Students can

- Request book loans
- View personal loans

Librarians can

- Create loans
- Return books
- Manage active loans

---

## Library Management

### Books

- Register books
- Assign authors
- Assign categories
- View registered books

### Authors

- Register authors
- View author information

### Categories

- Register categories
- View registered categories

---

## Authentication Administration

### User Management

Administrators can

- View registered users
- Change user roles
- Manage platform access

### Roles

- View available system roles
- Understand access permissions

---

## Campus Incident Service

- Create incidents
- View reported incidents
- Resolve incidents (Librarian)
- Delete incidents (Administrator)

---

## QR Access Service

- Generate QR access codes
- Validate QR credentials
- Revoke QR codes
- View generated QR codes
- View validation history

---

## Transport Service

- Manage transport routes
- Register stops
- Check route availability
- View transport information

---

## Space Availability Service

- Register campus spaces
- Update availability
- Manage capacities
- Check real-time availability
- Filter available spaces

---

# Role-Based Access Control (RBAC)

## Student

- Dashboard
- Notifications
- Profile
- Library Catalog
- Personal Loans
- QR Validation
- Transport Information
- Space Availability
- Campus Incidents

---

## Librarian

Includes all Student permissions plus

- Manage Books
- Manage Authors
- Manage Categories
- Create Loans
- Return Loans
- Resolve Incidents
- Manage Campus Spaces

---

## Administrator

Full platform access including

- User Management
- Role Management
- QR Administration
- Transport Management
- Space Management
- Incident Management
- Complete Library Administration

---

# Technologies

- Next.js
- React
- TypeScript
- Tailwind CSS
- App Router
- Fetch API
- JWT Authentication
- Socket.IO Client

---

# Communication

The frontend communicates **only** with the API Gateway.

The API Gateway forwards requests to the appropriate backend microservice.

This approach provides

- Loose coupling
- Centralized authentication
- Better security
- Simplified frontend architecture
- Easier scalability

---

# Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:3010
```

---

# Project Structure

```
apps/web-app
│
├── app/
│   ├── dashboard/
│   ├── notifications/
│   ├── profile/
│   ├── library/
│   ├── loans/
│   ├── manage/
│   ├── admin/
│   ├── qr-access/
│   ├── transport/
│   ├── space-availability/
│   └── incidents/
│
├── components/
├── context/
├── lib/
└── public/
```

---

# Design Principles

- API Gateway Pattern
- Role-Based Access Control (RBAC)
- Responsive Design
- Component Reusability
- Separation of Concerns
- Modern UI with Tailwind CSS
- Type Safety using TypeScript

---

# Supported Browsers

- Google Chrome
- Microsoft Edge
- Mozilla Firefox
- Opera

---

# Smart Campus Module 3

Universidad Central del Ecuador

Distributed Systems Project

Frontend developed using Next.js following a microservices architecture connected through an API Gateway.