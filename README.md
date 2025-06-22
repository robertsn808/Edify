# Edify Sales Platform

A comprehensive full-stack web application sales platform featuring admin and client portals, contact form management, document handling, and role-based access control for small business sales operations.

## Features

### 🌐 Public Landing Page
- Modern, responsive design with hero section
- Service features showcase
- Tiered pricing structure (Starter, Professional, Enterprise)
- Functional contact form with database integration
- Smooth scrolling navigation

### 👨‍💼 Admin Portal
- **Dashboard Analytics**: Real-time statistics for clients, projects, and inquiries
- **Contact Form Management**: View, respond to, and archive customer inquiries
- **Client Management**: Overview of all clients with status tracking
- **Email Integration**: Pre-filled email responses for quick customer communication
- **Role-based Access Control**: Secure admin-only sections

### 👤 Client Portal
- **Project Overview**: Track project progress with visual indicators
- **Document Center**: Access project documents with download functionality
- **E-signature Support**: Digital document signing capabilities
- **Message Center**: Communication with the Edify team
- **Milestone Tracking**: View upcoming project milestones and deadlines

### 🔐 Authentication & Security
- Replit OAuth integration for secure login
- Role-based access (admin/client)
- Session management with PostgreSQL storage
- Protected routes and API endpoints

## Tech Stack

### Frontend
- **React** with TypeScript
- **Wouter** for routing
- **TanStack Query** for data fetching and caching
- **shadcn/ui** component library
- **Tailwind CSS** for styling
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **PostgreSQL** database
- **Drizzle ORM** for database operations
- **Replit Auth** with OpenID Connect
- **Express Session** with PostgreSQL store

### Development Tools
- **Vite** for build tooling
- **TypeScript** for type safety
- **Drizzle Kit** for database migrations

## Getting Started

### Prerequisites
- Node.js 18 or higher
- PostgreSQL database access
- Replit account for authentication

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd edify-sales-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_session_secret
REPL_ID=your_replit_app_id
REPLIT_DOMAINS=your_domain.replit.app
```

4. Push database schema:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions and configurations
│   │   ├── pages/         # Application pages/routes
│   │   └── main.tsx       # Application entry point
├── server/                # Backend Express application
│   ├── db.ts             # Database connection
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Data access layer
│   ├── replitAuth.ts     # Authentication setup
│   └── index.ts          # Server entry point
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema and types
└── README.md
```

## API Endpoints

### Public Endpoints
- `POST /api/contact` - Submit contact form

### Authenticated Endpoints
- `GET /api/auth/user` - Get current user
- `GET /api/contact-forms` - Get all contact forms (admin only)
- `PATCH /api/contact-forms/:id/status` - Update contact form status (admin only)
- `GET /api/clients` - Get all clients (admin only)
- `GET /api/admin/stats` - Get admin dashboard statistics (admin only)

### Authentication Endpoints
- `GET /api/login` - Initiate login flow
- `GET /api/logout` - Logout user
- `GET /api/callback` - OAuth callback

## Database Schema

### Tables
- **users** - User accounts with role assignment
- **clients** - Client information and project details
- **contact_forms** - Contact form submissions from landing page
- **messages** - Communication between clients and admin
- **documents** - Project documents with signature requirements
- **sessions** - User session storage

## Deployment

The application is designed to run on Replit with:
- Automatic HTTPS
- Built-in PostgreSQL database
- Environment variable management
- Zero-config deployment

To deploy:
1. Import project to Replit
2. Configure environment variables
3. Run `npm run db:push`
4. Click "Run" to start the application

## Key Features in Detail

### Contact Form Integration
- Landing page form submissions are automatically stored in the database
- Admin dashboard displays all inquiries with full details
- One-click email responses with pre-filled templates
- Archive functionality to manage form status

### Role-Based Access
- Automatic role assignment (admin/client)
- Route protection based on user roles
- API endpoint security with role validation

### Document Management
- File upload and storage capabilities
- Digital signature workflow
- Download functionality with access tracking
- Status management (pending, signed, completed)

### Real-time Updates
- TanStack Query for efficient data synchronization
- Automatic cache invalidation on mutations
- Optimistic updates for better user experience

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary software developed for Edify web application services.

## Support

For support and inquiries, please contact the Edify team through the application's contact form or admin portal.