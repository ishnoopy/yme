# YME (Your Application Name)

A full-stack application built with React (Vite) frontend and Node.js (Hono) backend, featuring modern technologies and best practices.

## 🚀 Tech Stack

### Frontend
- React 19 with TypeScript
- Vite for build tooling
- TanStack Query for data fetching
- React Hook Form with Zod validation
- Tailwind CSS for styling
- Radix UI for accessible components
- React Router for navigation

### Backend
- Node.js with TypeScript
- Hono.js for API framework
- Prisma as ORM
- Redis for caching
- JWT for authentication
- PostgreSQL database
- Swagger/OpenAPI for API documentation

### DevOps
- Docker & Docker Compose
- PNPM for package management
- ESLint for code quality
- Environment-based configuration

## 📋 Prerequisites

Before you begin, ensure you have installed:
- Node.js (v20 or later)
- PNPM (v8 or later)
- Docker and Docker Compose
- PostgreSQL (if running locally)
- Redis (if running locally)

## 🛠 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd yme
   ```

2. **Set up environment variables**
   ```bash
   # Frontend (.env in frontend directory)
   cp frontend/.env.example frontend/.env

   # Backend (.env in backend directory)
   cp backend/.env.example backend/.env
   ```

3. **Install dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   pnpm install

   # Install backend dependencies
   cd ../backend
   pnpm install
   ```

4. **Database Setup**
   ```bash
   # Start PostgreSQL and Redis using Docker
   docker-compose -f docker-compose-db.yaml up -d

   # Generate Prisma client and run migrations
   cd backend
   pnpm prisma:generate
   pnpm prisma:push
   ```

## 🚀 Development

### Running the application locally

1. **Start the backend**
   ```bash
   cd backend
   pnpm dev
   ```
   The backend will be available at `http://localhost:3000`

2. **Start the frontend**
   ```bash
   cd frontend
   pnpm dev
   ```
   The frontend will be available at `http://localhost:5173`

### Using Docker Compose (Production-like environment in VPS)

```bash
# Build and start all services
docker-compose -f docker-compose.production.yaml up --build

# Stop all services
docker-compose -f docker-compose.production.yaml down
```

## 📚 API Documentation

- Swagger UI: `http://localhost:3000/api-docs`
- API Reference: `http://localhost:3000/reference`

## 🧪 Testing

```bash
# Run frontend tests
cd frontend
pnpm test

# Run backend tests
cd backend
pnpm test
```

## 📦 Project Structure
