# HarmonyHealth Client

Frontend application for Harmony Health & Beauty built with React, TypeScript, and Vite.

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Sass** - CSS preprocessor
- **ESLint** - Code linting

## Environment Variables

Create a `.env` file in the client root directory with the following variables:

| Variable | Description | Example Value | Required |
|----------|-------------|---------------|----------|
| `VITE_SERVER_URL` | Backend API server URL | `http://localhost:5500/` | ✅ |

### Environment Setup

1. **Copy the example environment file:**
	```bash
	cp .env.example .env
	```

2. **Update the values in `.env`:**
	```env
	VITE_SERVER_URL=http://localhost:5500/
	```

### Environment Variable Details

#### `VITE_SERVER_URL`
- **Type:** String
- **Description:** The base URL of your backend server. Must include the trailing slash.
- **Development Example:** `http://localhost:5500/`
- **Production Example:** `https://api.harmonyhealthbeauty.com/`

> **Note:** All Vite environment variables must be prefixed with `VITE_` to be exposed to the client application.

## Getting Started

1. **Install dependencies:**
	```bash
	npm install
	```

2. **Set up environment variables:**
	```bash
	cp .env.example .env
	# Edit .env with your server URL
	```

3. **Start development server:**
	```bash
	npm run dev
	```
	Application will be available at `http://localhost:5173`

4. **Build for production:**
	```bash
	npm run build
	```
	Production files will be in the `dist/` directory

5. **Preview production build:**
	```bash
	npm run preview
	```

## Project Structure

```
client/
├── public/								# Static assets
│   ├── fonts/							# Custom fonts
│   └── images/							# Images and icons
│       ├── app/						# Application UI images
│       ├── home/						# Homepage images
│       └── services/					# Service-specific images
├── src/
│   ├── app/							# Main application components
│   │   ├── footer/						# Footer component
│   │   ├── header/						# Header component
│   │   ├── theme-toggle/				# Dark/light theme toggle
│   │   └── global-context/				# Global state management
│   ├── components/						# Reusable UI components
│   │   ├── modal/						# Modal dialog component
│   │   ├── section/					# Section layout component
│   │   └── service-card/				# Service card component
│   ├── lib/							# Utility libraries
│   │   ├── api.ts						# API client utilities
│   │   ├── apiResponse.ts				# API response types
│   │   ├── customUtilityTypes.ts		# TypeScript utilities
│   │   └── utils.ts					# General utilities
│   ├── models/							# Data models
│   │   ├── Customer.tsx
│   │   ├── Employee.tsx
│   │   ├── Service.ts
│   │   └── ...
│   ├── pages/							# Page components
│   │   ├── auth/						# Authentication pages
│   │   ├── home/						# Homepage
│   │   ├── service/					# Individual service page
│   │   └── services/					# Services listing page
│   └── main.tsx						# Application entry point
├── index.html							# HTML template
├── vite.config.ts						# Vite configuration
└── tsconfig.json						# TypeScript configuration
```

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

### API Integration

The application uses a custom API client (`src/lib/api.ts`) for communication with the backend:

```typescript
import { api } from './lib/api'

// GET request
const services = await api.get('/service')

// POST request
const result = await api.post('/messaging/send-email', {
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Hello!'
})

// PUT request
const updated = await api.put('/service', { id, data })

// DELETE request
const deleted = await api.delete('/service', { id })
```

All API requests:
- Automatically prefix paths with `/api/`
- Include credentials for authentication
- Use JSON content type
- Return parsed JSON responses

### Global State Management

The application uses React Context for global state management:

```typescript
import useGlobal from './app/global-context/global.context'

function MyComponent() {
  const { activeUser, setActiveUser } = useGlobal()
  
  // Access or update active user
}
```

### Styling

- **Sass** is used for styling with `.sass` files (indented syntax)
- Global styles are in `src/app/`
- Component-specific styles are co-located with components
- Theme variables and colors defined in `app.styles.sass` and `styles.colors.sass`
- Material Symbols icons are available via the `styles.icons.sass` file

### Fonts

The application uses the following Google Fonts:
- **Josefin Sans** - Headings and display text
- **Montserrat** - Body text and UI
- **Quicksand** - Accent text

## Building for Production

1. **Build the application:**
	```bash
	npm run build
	```

2. **Test the production build:**
	```bash
	npm run preview
	```

3. **Deploy the `dist/` folder** to your hosting service (Vercel, Netlify, AWS S3, etc.)

### Production Checklist

- [ ] Update `VITE_SERVER_URL` to production API URL
- [ ] Ensure all environment variables are set correctly
- [ ] Test the production build with `npm run preview`
- [ ] Verify all API endpoints are accessible
- [ ] Check that CORS is properly configured on the backend
- [ ] Optimize images in `public/` folder if needed
- [ ] Review build output for any warnings

## Browser Support

The application supports all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow TypeScript best practices
2. Use functional components with hooks
3. Keep components small and focused
4. Co-locate styles with components
5. Add proper TypeScript types for all props and functions
6. Test your changes locally before committing
7. Run `npm run lint` before committing

## Development Tips

- Hot Module Replacement (HMR) is enabled for fast development
- React components will preserve state during updates
- Sass files are automatically compiled
- TypeScript errors are shown in the terminal and browser
- Use React DevTools browser extension for debugging
