# Trisha's 25th Birthday Trivia Celebration

## Overview

This is an interactive birthday trivia web application built to celebrate Trisha Agrawal's 25th birthday. The application features a comprehensive trivia game with questions about Trisha's journey from Union College to Goldman Sachs, including her education, career, personal achievements, and fun facts. Users can play the trivia game, view a photo gallery of memories, check leaderboards, and administrators can manage questions through a dedicated admin panel.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent, accessible design
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **Animations**: Framer Motion for smooth animations and interactive elements
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Forms**: React Hook Form with Zod validation for type-safe form handling

### Backend Architecture
- **Runtime**: Node.js with Express.js web framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **API Design**: RESTful API structure with dedicated routes for questions, game sessions, and analytics
- **Middleware**: Custom logging middleware for API request tracking and error handling
- **Session Storage**: In-memory storage implementation with interface abstraction for future database integration

### Data Storage Solutions
- **ORM**: Drizzle ORM configured for PostgreSQL with type-safe database operations
- **Database**: PostgreSQL (configured but using in-memory storage currently)
- **Schema**: Structured tables for users, questions, and game sessions with proper relationships
- **Migrations**: Drizzle-kit for database schema management and migrations

### Development & Build Architecture
- **Build Tool**: Vite for fast development and optimized production builds
- **Development Server**: Integrated Vite dev server with Express for full-stack development
- **TypeScript**: Shared types between frontend and backend using a shared schema directory
- **Module Resolution**: Path aliases for clean imports and better code organization

### Authentication and Authorization
- **Current State**: Basic structure in place with user schema defined
- **Future Enhancement**: Ready for session-based authentication implementation

## External Dependencies

### Core Technologies
- **@neondatabase/serverless**: PostgreSQL serverless driver for database connectivity
- **drizzle-orm**: Type-safe ORM for database operations with PostgreSQL support
- **drizzle-zod**: Integration between Drizzle and Zod for schema validation

### UI and Styling
- **@radix-ui/**: Comprehensive set of unstyled, accessible UI primitives
- **tailwindcss**: Utility-first CSS framework for responsive design
- **framer-motion**: Animation library for smooth UI transitions and effects
- **lucide-react**: Icon library for consistent iconography

### Development Tools
- **tsx**: TypeScript execution environment for development
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Replit-specific development enhancements

### Form and Validation
- **react-hook-form**: Performant form library with minimal re-renders
- **@hookform/resolvers**: Validation resolvers for React Hook Form
- **zod**: TypeScript-first schema validation library

### Utilities
- **date-fns**: Date manipulation and formatting library
- **clsx** & **tailwind-merge**: Utility functions for conditional CSS classes
- **class-variance-authority**: Type-safe variant styling for components