# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a dual-purpose Next.js 14 application combining:
- **Public site**: A coworking café website (Cow-or-King Café by Anticafé in Strasbourg)
- **Admin dashboard**: A real estate management admin template (Lahomes)

The project uses the App Router with TypeScript and SCSS for styling.

## Commands

### Development
```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm start            # Run production build
npm run lint         # Run ESLint
```

## Architecture

### Dual Layout System

The application has two distinct layouts with separate routing:

1. **Public Site** (`src/app/(site)/`)
   - Marketing pages for the coworking café
   - Uses Bootstrap-based components
   - Layout: `src/app/(site)/layout.tsx` with Header and Footer
   - Pages: home, about, blog, contact, faq, pricing, projects, services

2. **Admin Dashboard** (`src/app/dashboard/`)
   - Real estate management admin interface
   - Uses route groups: `(admin)` for main dashboard pages
   - Layout: `src/app/dashboard/layout.tsx` with splash screen
   - Multiple contexts for state management (Layout, Notification, Chat, Email)

### Route Groups

- `(site)`: Public-facing marketing pages
- `(admin)`: Dashboard pages requiring authentication

### Middleware

`middleware.ts` redirects root path (`/`) to `/dashboards/analytics` and includes next-auth middleware for authentication.

### State Management

Located in `src/context/`:
- `useLayoutContext.tsx`: Theme customization, topbar/menu settings, offcanvas states
  - Persists settings in localStorage under `__REBACK_NEXT_CONFIG__`
  - Supports theme modes (light/dark), menu sizing, topbar themes
- `useNotificationContext.tsx`: Notification state
- `useChatContext.tsx`: Chat functionality
- `useEmailContext.tsx`: Email functionality

### Component Organization

- `src/components/`: Shared components
  - `layout/`: TopNavigationBar, VerticalNavigationBar, Footer
  - `wrappers/`: AppProvidersWrapper (SessionProvider, LayoutProvider, NotificationProvider)
  - `from/`: Form components
- Dashboard pages follow a pattern: `page.tsx` imports components from local `components/` or `Components/` directories

### Menu System

Navigation is centrally managed in `src/assets/data/menu-items.ts` with hierarchical menu structure. Helper functions in `src/helpers/Manu.ts` handle menu item lookup, parent finding, and URL-based active state.

### Styling

- Main styles: `src/assets/scss/app.scss` (dashboard), `src/assets/scss/main.scss` (public site)
- Uses SASS with modular structure: `components/`, `pages/`, `structure/`, `config/`, `plugins/`
- Bootstrap 5.3.3 integration
- Icon libraries: Bootstrap Icons, Font Awesome, custom icon sets

### Path Aliases

TypeScript configured with `@/*` alias mapping to `./src/*`.

### Data Files

Static data stored in `src/assets/data/` for components, charts, and menu items.

### Utilities

`src/utils/`:
- `layout.ts`: DOM attribute toggling for theme/layout changes
- `change-casing.ts`: String casing transformations
- `date.ts`: Date utilities
- `get-icons.ts`: Icon handling
- `promise.ts`: Promise utilities

### Type Definitions

`src/types/`: TypeScript definitions for menu items, context types, component props

### Environment

- Environment variables in `.env.local`
- Authentication via next-auth (SessionProvider wraps dashboard)

## Key Technologies

- Next.js 14.2.17 (App Router)
- React 18
- TypeScript 5.9.3
- Bootstrap 5.3.3
- SCSS/SASS
- Framer Motion (motion package)
- Swiper slider
- Next-auth for authentication
- Figtree font (Google Fonts)
