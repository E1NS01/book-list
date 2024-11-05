# Book List Monorepo

A full-stack application for managing books, built in a monorepo structure using Turborepo.

## Architecture

This monorepo constis of the following applications:

- `frontend`: A Vite + React application with TypeScript and Tailwind CSS
- `backend`: A NestJS application with PostgreSQL database using Prisma

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm, yarn or npm
- Docker and Docker Compose (for the PostgreSQL database)

### Installation

1. Clone the repository

```bash
git clone https://github.com/E1NS01/book-list
cd book-list
```

2. Install dependencies:

```bash
yarn install
```

3. Start the development environment:

```bash
yarn dev
```

This will:

- Start PostgreSQL in a Docker container
- Start the backend service in a Docker container (accessible on port 3000)
- Start the frontend service in a Docker container (accessible on port 1234)

## Development

### Frontend

The frontend is build with:

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI

### Backend

The backend is built with:

- NestJS
- PostgreSQL
- Prisma
- Swagger

### API Documentation

Once the backend is runnning you can access the Swagger documentaion at:

```
http://localhost:3000/api
```

## Docker Support

The project includes Docker configuration for both frontend and backend services. The database is also containerized using Docker Compose.

To run the entire application using docker:

```bash
docker compose up
```
