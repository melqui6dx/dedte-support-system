# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a support ticket management system for DEDTE (Departamento de Tecnología Educativa) built with React, Vite, Tailwind CSS v4, and Supabase. The system manages student support requests with features like real-time updates, categories, analytics, and file attachments.

## Common Commands

### Development
```bash
npm run dev          # Start development server with Vite
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint on all files
```

## Architecture

### Tech Stack
- **Frontend Framework**: React 19.1.1 with functional components and hooks
- **Build Tool**: Vite 7.1.7
- **Styling**: Tailwind CSS v4.1.14 (using @tailwindcss/vite plugin)
- **Backend**: Supabase (database + real-time subscriptions + storage)
- **Icons**: lucide-react

### Project Structure
```
src/
├── App.jsx                           # Root component with data loading and real-time subscriptions
├── components/
│   └── SistemaSoporteDEDTE.jsx      # Main UI component (900+ lines, single-file design)
├── lib/
│   └── supabase.js                  # Supabase client initialization
└── utils/
    └── api.js                       # API utility functions for CRUD operations
```

### Database Schema (Supabase)
The application uses the following main tables:
- **solicitudes**: Support requests with student info, category, status, priority, attachments
- **categorias**: Request categories with name, color, and active status
- **adjuntos**: File attachments linked to requests
- **historial**: Activity history/comments for requests

### Key Architecture Patterns

1. **Real-time Data Sync**: App.jsx subscribes to Postgres changes via Supabase channels for live updates on `solicitudes` and `categorias` tables.

2. **Single Large Component**: The main UI (`SistemaSoporteDEDTE.jsx`) is intentionally a large single-file component (~955 lines) containing:
   - Multiple sub-components (modals, tables, dashboard)
   - View state management (solicitudes, dashboard, categorías)
   - Mock data for development/prototyping

3. **Data Flow**:
   - App.jsx loads data from Supabase and passes as props to SistemaSoporteDEDTE
   - Real-time updates trigger automatic re-renders
   - API functions in `utils/api.js` handle all database mutations

4. **Environment Variables**: Supabase configuration uses Vite env vars:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Component Breakdown (SistemaSoporteDEDTE.jsx)

The main component includes these nested components:
- **ModalDetalleSolicitud**: View full request details with student info, attachments, actions
- **TablaSolicitudes**: Filterable/searchable table of all requests
- **GestionCategorias**: Category management with create/edit/delete
- **Dashboard**: Analytics view with metrics by status, category, and faculty
- **ModalNuevaSolicitud**: Form to create new support requests
- **ModalGestionCategoria**: Form for category creation/editing

### State Management
- Uses React hooks (useState, useEffect) for local state
- No global state management library (Redux, Zustand, etc.)
- Props drilling from App.jsx to main component
- Each modal/view manages its own form state

### Styling Approach
- Tailwind CSS v4 with utility classes
- Custom colors for category badges
- Responsive design with mobile-first breakpoints
- Gradient cards for dashboard metrics

## Authentication

The system uses Supabase Authentication with email/password for credential-based access:

- **Login Flow**: Users must authenticate before accessing the system
- **Protected Routes**: The entire application is wrapped in authentication checks
- **Auth Context**: `src/contexts/AuthContext.jsx` provides auth state and methods (`useAuth` hook)
- **Login Component**: `src/components/Login.jsx` handles the login UI
- **Session Management**: Supabase handles sessions automatically with token refresh
- **Logout**: Users can sign out via the header logout button

### Setting Up Users in Supabase

To add authorized personnel:
1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User" or "Invite User"
3. Enter email and password for the staff member
4. Users will authenticate with these credentials

The system does not have a public signup form - all users must be created by administrators in the Supabase dashboard.

## Development Notes

- The codebase currently has mock data in `SistemaSoporteDEDTE.jsx` (mockSolicitudes, mockCategorias) for development purposes
- File uploads are implemented but use placeholder functionality in the UI
- The system supports multiple communication channels: WhatsApp, form, email, presencial
- Request states: pendiente, en_revision, en_proceso, resuelto, cerrado
- Priority levels: baja, media, alta, urgente
