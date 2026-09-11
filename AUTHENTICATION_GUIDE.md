# Authentication & Role-Based Access Control System

## 📋 Overview

This document describes the complete authentication and role-based access control (RBAC) system implemented in your Book Management React app.

## 🏗️ Architecture

### Core Components

#### 1. **AuthContext** (`src/context/AuthContext.jsx`)

- Manages authentication state globally
- Stores user info and JWT token
- Provides `useAuth()` hook for accessing auth state
- Persists auth data in localStorage
- Key methods: `login()`, `logout()`

#### 2. **authService** (`src/service/authService.js`)

- Handles API communication for authentication
- Manages token storage
- Provides authenticated request headers
- Key methods:
  - `register()` - Create new account
  - `login()` - Authenticate user
  - `getHeaders()` - Get auth headers with token
  - `getAuthToken()` - Get stored token

#### 3. **Protected Routes** (`src/components/ProtectedRoute.jsx`)

- `ProtectedRoute` - For authenticated users
- `AdminRoute` - For admin users only
- Redirects unauthenticated users to `/login`
- Redirects non-admin users to `/forbidden`

#### 4. **Navbar** (`src/components/Navbar.jsx`)

- Displays different navigation based on auth state
- Shows role-based menu items
- Logout functionality

## 🔐 Authentication Flow

### Registration

1. User fills registration form (name, email, password)
2. Frontend validates password requirements
3. Sends POST to `/api/auth/register`
4. User redirected to login page

### Login

1. User enters email and password
2. Frontend sends POST to `/api/auth/login`
3. Backend returns user object and JWT token
4. AuthContext stores both in localStorage
5. User redirected to `/books` page

### Logout

1. User clicks logout button
2. AuthContext clears localStorage
3. User redirected to `/login`

## 👥 Role-Based Access Control

### User Roles

#### `user` (Regular User)

**Allowed:**

- View all books (`/books`)
- View book details (`/books/:id`)
- View own profile (`/profile`)

**Not Allowed:**

- Add books
- Edit books
- Delete books
- Access admin routes

#### `admin` (Administrator)

**Allowed:**

- All user permissions
- Add new books (`/admin/books/add`)
- Edit books (`/admin/books/edit/:id`)
- Delete books (via BookCard or details page)
- See admin buttons in navbar and on book cards

**Not Allowed:**

- Same restrictions as users when logged in as user

## 🛣️ Routes Structure

```
PUBLIC ROUTES:
  /                    - HomePage (unauthenticated users see login options)
  /login              - LoginPage
  /register           - RegisterPage

PROTECTED ROUTES (Authenticated Users):
  /books              - BooksPage (book listing)
  /books/:id          - BookDetailsPage (book details)
  /profile            - ProfilePage (user profile)

ADMIN ROUTES (Admins Only):
  /admin/books/add    - AddBookPage
  /admin/books/edit/:id - EditBookPage

ERROR ROUTES:
  /forbidden          - ForbiddenPage (403 error)
  *                   - 404 Not Found
```

## 📄 Page Components

### Public Pages

#### LoginPage (`src/pages/LoginPage.jsx`)

- Email and password inputs
- Error handling
- Link to register
- Redirects to `/books` on success

#### RegisterPage (`src/pages/RegisterPage.jsx`)

- Name, email, password, confirm password inputs
- Password validation
- Error handling
- Link to login
- Creates user with `role: 'user'` by default

#### HomePage (`src/pages/HomePage.jsx`)

- Landing page with call-to-action
- Shows different content for authenticated vs unauthenticated users

### Protected Pages

#### BooksPage (`src/pages/BooksPage.jsx`)

- Grid layout of all books
- Uses BookCard component for each book
- Loading and error states

#### BookDetailsPage (`src/pages/BookDetailsPage.jsx`)

- Full book information
- Admin-only Edit and Delete buttons
- Back to books navigation

#### ProfilePage (`src/pages/ProfilePage.jsx`)

- User information display
- Shows role and account creation date

#### AddBookPage (`src/pages/AddBookPage.jsx`)

- Form to create new book
- Admin only
- Requires authentication token

#### EditBookPage (`src/pages/EditBookPage.jsx`)

- Form to edit existing book
- Admin only
- Pre-loads current book data
- Requires authentication token

#### ForbiddenPage (`src/pages/ForbiddenPage.jsx`)

- 403 Forbidden error page
- Shown when non-admin tries to access admin route

## 🎨 UI Components

### BookCard (`src/components/BookCard.jsx`)

- Displays book information
- All users: View button
- Admins: Edit and Delete buttons
- Uses role-based conditional rendering

### Navbar (`src/components/Navbar.jsx`)

- Shows Book Management title and logo
- Authenticated users see:
  - Books link
  - Add Book link (admins only)
  - Profile link
  - Logout button with user info
- Unauthenticated users see:
  - Login link
  - Register link

## 🔒 Security Features

### Token Management

- JWT stored in localStorage
- Included in all authenticated requests via `Authorization: Bearer {token}` header
- Token cleared on logout

### Protected Endpoints

- All book operations require valid token
- Admin operations checked both frontend and backend
- Backend must verify user role for admin actions

### Route Protection

- Frontend routes protected by ProtectedRoute and AdminRoute wrappers
- Automatic redirects for unauthorized access
- Loading state during auth check

## 🛠️ Implementation Guide

### Using the Auth Hook

```javascript
import { useAuth } from "../context/AuthContext";

function MyComponent() {
  const { user, token, isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <div>
      {isAuthenticated && <p>Welcome {user.name}!</p>}
      {isAdmin && <p>Admin features available</p>}
    </div>
  );
}
```

### Making Authenticated Requests

```javascript
import { authService } from "../service/authService";

async function fetchData() {
  const response = await fetch("http://localhost:3000/api/resource", {
    headers: authService.getHeaders(),
  });
  const data = await response.json();
  return data;
}
```

### Creating Protected Routes

```javascript
import { ProtectedRoute, AdminRoute } from "../components/ProtectedRoute";

<Routes>
  {/* User can access */}
  <Route
    path="/books"
    element={
      <ProtectedRoute>
        <BooksPage />
      </ProtectedRoute>
    }
  />

  {/* Only admin can access */}
  <Route
    path="/admin/books/add"
    element={
      <AdminRoute>
        <AddBookPage />
      </AdminRoute>
    }
  />
</Routes>;
```

## 🔄 Data Flow

### Login Flow

```
LoginPage Form Submit
    ↓
authService.login(credentials)
    ↓
POST /api/auth/login
    ↓
Backend validates & returns token + user
    ↓
AuthContext.login(userData, token)
    ↓
Store in localStorage & state
    ↓
Navigate to /books
```

### Protected Route Access

```
User navigates to /books
    ↓
ProtectedRoute component renders
    ↓
Check AuthContext.isAuthenticated
    ↓
If false → Redirect to /login
If true → Render BooksPage
```

### Admin Route Access

```
User navigates to /admin/books/add
    ↓
AdminRoute component renders
    ↓
Check AuthContext.isAuthenticated
    ↓
If false → Redirect to /login
If true → Check AuthContext.isAdmin
    ↓
If false → Redirect to /forbidden
If true → Render AddBookPage
```

## 🐛 Common Issues & Solutions

### Token Not Persisting

- Ensure localStorage is not cleared on logout
- Check browser localStorage settings
- Verify token format in authService

### Routes Not Protecting

- Ensure ProtectedRoute/AdminRoute wraps the component
- Check AuthProvider is in App.jsx
- Verify auth state is loading correctly

### Backend Returns 401

- Token might be expired
- Token might not be in correct format
- Check Authorization header format: `Bearer {token}`

### Users Can Access Admin Routes by URL

- This is blocked by AdminRoute component
- Backend must also verify admin role
- Never trust frontend validation alone

## 📝 Backend Requirements

Your Express/MongoDB backend must:

1. **Authentication Endpoints**
   - `POST /api/auth/register` - Create user with `role: 'user'`
   - `POST /api/auth/login` - Return user object + JWT token

2. **Token Format**

   ```javascript
   {
     token: "jwt_token_here",
     user: {
       _id: "...",
       name: "...",
       email: "...",
       role: "user" or "admin"
     }
   }
   ```

3. **Protected Endpoints**
   - Verify `Authorization: Bearer {token}` header
   - Verify token validity
   - Check user role for admin operations

4. **Book Operations**
   - GET `/api/books` - Anyone (authenticated)
   - GET `/api/books/:id` - Anyone (authenticated)
   - POST `/api/books` - Admin only
   - PUT `/api/books/:id` - Admin only
   - DELETE `/api/books/:id` - Admin only

## 🚀 Next Steps

1. Ensure your backend has proper authentication endpoints
2. Test login/register flow with your backend
3. Test role-based access control
4. Implement password hashing on backend
5. Consider token refresh mechanism for long sessions
6. Add email verification for registration

## 📚 Files Summary

```
src/
├── context/
│   └── AuthContext.jsx           # Auth state management
├── service/
│   ├── authService.js            # Auth API calls
│   └── bookService.js            # Book API calls (updated)
├── components/
│   ├── ProtectedRoute.jsx        # Route protection
│   ├── Navbar.jsx                # Navigation
│   └── BookCard.jsx              # Book display (updated)
├── pages/
│   ├── LoginPage.jsx             # Login form
│   ├── RegisterPage.jsx          # Registration form
│   ├── HomePage.jsx              # Landing page (updated)
│   ├── BooksPage.jsx             # Book listing (updated)
│   ├── BookDetailsPage.jsx       # Book detail view
│   ├── AddBookPage.jsx           # Add book form (admin)
│   ├── EditBookPage.jsx          # Edit book form (admin)
│   ├── ProfilePage.jsx           # User profile
│   └── ForbiddenPage.jsx         # 403 error page
├── routes/
│   ├── AppRoutes.jsx             # Complete routing (new)
│   └── BooksRoute.jsx            # Old routing (deprecated)
└── App.jsx                       # Updated with AuthProvider
```

---

For questions or issues, refer to the auth flow diagrams above or check the inline code comments.
