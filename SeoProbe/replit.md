# SEO Analyzer

## Overview

This is a full-stack SEO analysis application built with a modern web technology stack. The application allows users to analyze web pages for SEO optimization by scraping meta tags, social media tags, and other SEO-relevant elements. It provides detailed analysis reports, search engine previews, and actionable recommendations for improving SEO performance.

The system follows a monolithic architecture with a clear separation between client and server code, using shared schemas for type safety across the full stack.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with a single analysis endpoint
- **Data Storage**: In-memory storage with interface-based design for future database integration
- **Web Scraping**: Axios for HTTP requests and Cheerio for HTML parsing
- **Session Management**: Ready for PostgreSQL session storage with connect-pg-simple

### Data Layer
- **Schema Management**: Zod for runtime type validation and shared type definitions
- **Database ORM**: Drizzle ORM configured for PostgreSQL (currently using in-memory storage)
- **Type Safety**: Shared schema definitions between client and server in `/shared` directory

### Development Environment
- **Monorepo Structure**: Single repository with client, server, and shared code
- **Hot Reload**: Vite development server with HMR for frontend
- **Development Tools**: TSX for TypeScript execution, custom logging middleware
- **Error Handling**: Runtime error overlay for development debugging

### Key Design Patterns
- **Separation of Concerns**: Clear boundaries between data access, business logic, and presentation
- **Interface-based Storage**: IStorage interface allows switching between in-memory and database storage
- **Shared Types**: Common type definitions prevent client-server type mismatches
- **Component Composition**: Modular UI components following single responsibility principle

### SEO Analysis Engine
- **Meta Tag Extraction**: Comprehensive parsing of HTML meta tags, Open Graph, Twitter Cards
- **Content Analysis**: Title, description, headings, and structural element extraction
- **Preview Generation**: Google and social media search result previews
- **Recommendation System**: Automated SEO recommendations based on analysis results

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18 with TypeScript, React DOM, TanStack Query for data fetching
- **Node.js Backend**: Express.js server framework with TypeScript support
- **Build Tools**: Vite for frontend bundling, ESBuild for server-side bundling

### UI and Styling
- **Component Library**: Radix UI primitives for accessible, unstyled components
- **Design System**: shadcn/ui component collection built on Radix UI
- **Styling Framework**: Tailwind CSS with PostCSS for processing
- **Icons**: Lucide React for consistent iconography

### Data and Validation
- **Schema Validation**: Zod for runtime type checking and validation
- **Database ORM**: Drizzle ORM with PostgreSQL dialect support
- **Database Driver**: @neondatabase/serverless for PostgreSQL connections

### Web Scraping and Analysis
- **HTTP Client**: Axios for making web requests with timeout and header support
- **HTML Parser**: Cheerio for server-side jQuery-like HTML manipulation
- **URL Processing**: Built-in Node.js URL API for parsing and validation

### Development and Quality
- **TypeScript**: Full type safety across the application
- **Development Server**: Vite development server with hot module replacement
- **Error Handling**: @replit/vite-plugin-runtime-error-modal for development error display
- **Code Mapping**: @jridgewell/trace-mapping for better error stack traces

### Production Dependencies
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **Form Handling**: @hookform/resolvers for form validation integration
- **Utility Libraries**: clsx and class-variance-authority for conditional styling
- **Date Handling**: date-fns for date manipulation and formatting