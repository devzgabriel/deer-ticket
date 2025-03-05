Deer Ticket 🦌
A modern ticket management system built with NestJS and React Vite in a Turborepo monorepo.

<img alt="Deer Ticket Banner" src="https://via.placeholder.com/1200x300/F8F0E5/331D2C?text=Deer+Ticket">
🔍 Overview
Deer Ticket is a streamlined platform designed for efficient team ticket management. Create, assign, and track tickets with skill-based routing to ensure tasks reach the right team members.

✨ Key Features
Ticket Submission - Create tickets with title, description, and deadline
Skill-based Assignment - Automatically route tickets to qualified team members
Status Tracking - Monitor ticket progress through a clean dashboard
Team Management - Organize members and their skills for optimal task distribution
🏗️ Architecture
Deer Ticket is built as a full-stack monorepo using Turborepo:

🚀 Getting Started
Prerequisites
Node.js 16+
pnpm (recommended) or npm/yarn
Installation
Development
Start the development servers:

Access the app at:

Frontend: http://localhost:5173
API: http://localhost:3000
Building for Production
💻 Tech Stack
Backend (NestJS)
REST API with full CRUD operations
Prisma ORM with SQLite database
Input validation with class-validator
Skill-based ticket assignment logic
Frontend (React + Vite)
Modern React with hooks and TypeScript
Form handling with react-hook-form
UI components with shadcn/ui
State management with React Query
📋 API Documentation
Endpoints
Tickets
GET /tickets - List all tickets
GET /tickets/:id - Get ticket details
POST /tickets - Create new ticket
PATCH /tickets/:id - Update ticket
PATCH /tickets/:id/status - Update ticket status
DELETE /tickets/:id - Delete ticket
Team Members
GET /team-members - List all members
GET /team-members/:id - Get member details
