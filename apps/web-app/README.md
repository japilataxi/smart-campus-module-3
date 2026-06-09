
---

# apps/web-app/README.md

```md
# Smart Campus Web App

## Overview

Modern web interface for the Smart Campus platform.

The application communicates exclusively through the API Gateway.

## Port

3003

## Features

### Authentication

- Login
- Register
- Logout

### Student

- View Library Catalog
- Request Loans
- View Personal Loans
- View Profile

### Librarian

- Manage Books
- Manage Authors
- Manage Categories
- View Loans
- Return Loans

### Admin

- Manage Users
- Manage Roles
- Full Library Management

## Architecture

Client → API Gateway → Microservices

## Technology

- Next.js
- React
- TypeScript
- Tailwind CSS
- App Router

## Environment Variable

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api