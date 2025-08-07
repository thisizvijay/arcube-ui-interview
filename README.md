# Arcube UI Interview

A modern Next.js application with authentication system.

## Features

- **Beautiful Login Page**: Modern, responsive login interface with gradient design
- **Authentication System**: JWT-based authentication with backend integration
- **User Dashboard**: Comprehensive dashboard showing user profile, permissions, and account details
- **Role-Based Access**: Support for different user roles (admin, partner, user)
- **System Role Restriction**: System accounts are restricted from UI access
- **Test Credentials**: Pre-configured test accounts for easy testing

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Backend server running on `http://localhost:8080`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Test Credentials

The application comes with pre-configured test accounts:

| Role | Email | Password | UI Access |
|------|-------|----------|-----------|
| Admin | admin@arcube.com | Admin@123456 | ✅ Allowed |
| Partner | partner@emirates.com | Partner@123456 | ✅ Allowed |
| User | vijaykumar4495@gmail.com | User@123456 | ✅ Allowed |
| System | system@arcube.com | System@123456 | ❌ Not Allowed |

**Note**: System accounts are restricted from accessing the user interface and will be automatically logged out if attempted.

## How to Use

1. **Access the Application**: Navigate to `http://localhost:3000`
2. **Login**: You'll be automatically redirected to the login page
3. **Choose Test Account**: Click on any of the test credential buttons to auto-fill the form
4. **Sign In**: Click the "Sign in" button to authenticate
5. **Dashboard**: After successful login, you'll be redirected to the dashboard
6. **Logout**: Use the logout button in the top-right corner to sign out

## Features

### Login Page (`/login`)
- Modern gradient design with smooth animations
- Email and password validation
- Show/hide password functionality
- Loading states and error handling
- Test credential buttons for easy testing
- Responsive design for all screen sizes

### Dashboard (`/dashboard`)
- User profile display with avatar
- Role-based styling and icons
- Permission display
- Account details and timestamps
- Quick action buttons
- Responsive layout

### Authentication Flow
- JWT token storage in localStorage
- Automatic token validation
- Redirect to login for unauthenticated users
- Automatic logout on token expiration

## Backend Integration

The frontend connects to the backend API endpoints:

- `POST /auth/login` - User authentication
- `GET /auth/profile` - User profile retrieval

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Fetch API
- **State Management**: React hooks
- **Routing**: Next.js App Router

## Project Structure

```
app/
├── login/
│   └── page.tsx          # Login page
├── dashboard/
│   └── page.tsx          # Dashboard page
└── page.tsx              # Root page (redirects to login)
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

The frontend expects the backend to be running on `http://localhost:3001`. If your backend is running on a different port, update the API URLs in:

- `app/login/page.tsx` (line 47)
- `app/dashboard/page.tsx` (line 58)

## Security Features

- Password field with show/hide toggle
- Input validation and sanitization
- Secure token storage
- Automatic logout on authentication errors
- CORS-compliant API calls

## Responsive Design

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

All components adapt their layout and styling based on screen size.
