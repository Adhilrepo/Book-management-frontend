# Quick Start Guide - Authentication System

## ✅ Setup Complete!

All authentication and role-based access control components have been implemented. Here's what to do next:

## 🚀 Getting Started

### 1. Verify Backend Endpoints

Your Express/MongoDB backend MUST have these endpoints:

#### Authentication

```
POST /api/auth/register
Body: { name, email, password, role: "user" }
Response: { success, message, user: { _id, name, email, role }, token }

POST /api/auth/login
Body: { email, password }
Response: { token, user: { _id, name, email, role } }
```

#### Book Operations

```
GET /api/books (authenticated)
GET /api/books/:id (authenticated)
POST /api/books (admin only)
PUT /api/books/:id (admin only)
DELETE /api/books/:id (admin only)
```

### 2. Backend Requirements

Make sure your backend:

✅ Returns `_id` field in book objects (not `id`)
✅ Validates `Authorization: Bearer {token}` header
✅ Returns user with `role` field ('user' or 'admin')
✅ Verifies admin role before create/update/delete operations
✅ Returns proper error messages

### 3. Test the System

#### Start Frontend

```bash
npm run dev
```

#### Test Registration

1. Go to http://localhost:5173/register
2. Create account with name, email, password
3. Should redirect to /login

#### Test Login

1. Use credentials from registration
2. Should redirect to /books page
3. Check browser localStorage for `authToken` and `authUser`

#### Test User Role

1. Logged in as user
2. Go to /books - should see books with only "View" button
3. Try to access /admin/books/add manually
4. Should redirect to /forbidden page

#### Test Admin Role

1. Login with admin account (set `role: 'admin'` on backend during testing)
2. Go to /books - should see View, Edit, Delete buttons
3. Access /admin/books/add - should load add form
4. Can create/edit/delete books

#### Test Protected Routes

1. Clear localStorage (or logout)
2. Try to access /books directly
3. Should redirect to /login

#### Test Navbar Changes

1. Logout (click logout button)
2. Navbar should show Login/Register links
3. Login again
4. Navbar should show Books, Profile, Logout
5. If admin, should also show "Add Book"

## 🔧 File Structure Created

```
src/
├── context/
│   └── AuthContext.jsx              ← Auth state management
├── service/
│   ├── authService.js               ← Auth API calls
│   └── bookService.js               ← Updated with auth
├── components/
│   ├── ProtectedRoute.jsx           ← Route protection
│   ├── Navbar.jsx                   ← Role-aware nav
│   └── BookCard.jsx                 ← Updated with actions
├── pages/
│   ├── LoginPage.jsx                ← Login form
│   ├── RegisterPage.jsx             ← Register form
│   ├── HomePage.jsx                 ← Landing (updated)
│   ├── BooksPage.jsx                ← Books grid (updated)
│   ├── BookDetailsPage.jsx          ← Book detail
│   ├── AddBookPage.jsx              ← Admin add book
│   ├── EditBookPage.jsx             ← Admin edit book
│   ├── ProfilePage.jsx              ← User profile
│   └── ForbiddenPage.jsx            ← 403 error
├── routes/
│   ├── AppRoutes.jsx                ← New routing (use this!)
│   └── BooksRoute.jsx               ← Old (deprecated)
└── App.jsx                          ← Updated with AuthProvider
```

## 🎯 Key Features Implemented

✅ JWT token-based authentication
✅ Persistent login (localStorage)
✅ Role-based route protection (user/admin)
✅ Automatic redirect on auth state change
✅ Loading states during auth check
✅ Conditional UI rendering based on role
✅ Secure API calls with auth headers
✅ Logout functionality
✅ 403 Forbidden page for unauthorized access
✅ Responsive navbar with role-aware menu

## 📝 Important Notes

### Security

- ⚠️ Frontend protection + backend verification required
- ⚠️ Never trust only UI hiding for security
- ⚠️ Backend must validate user role for all admin operations
- ⚠️ Store token securely (localStorage is OK for dev/demo)

### Testing Admin Features

To test admin features, you have two options:

1. **Quick Testing**: Modify login response to include `role: 'admin'`
2. **Proper Testing**: Create admin user in database with admin privileges

### Common Fixes

If login doesn't work:

1. Check backend auth endpoints are working
2. Check CORS is enabled on backend
3. Verify API URL is correct (http://localhost:3000/api/auth)
4. Check response format matches expected structure

If routes don't load:

1. Verify all pages are imported in AppRoutes.jsx
2. Check AuthProvider wraps Routes in App.jsx
3. Check BrowserRouter is in main.jsx

If buttons don't appear:

1. Check `isAdmin` is true in auth context
2. Verify user.role === 'admin' in backend response
3. Check localStorage shows role correctly

## 🐛 Troubleshooting

### "useAuth must be used within an AuthProvider"

- Make sure App.jsx has `<AuthProvider>` wrapper
- Check main.jsx renders App inside BrowserRouter

### Routes not redirecting

- Verify ProtectedRoute/AdminRoute are wrapping components
- Check AuthContext is providing correct state
- Clear localStorage and re-login

### API calls failing

- Check authService.getHeaders() includes token
- Verify backend accepts Authorization header
- Check token format is "Bearer {token}"

### Admin buttons not showing

- Verify user.role in localStorage is 'admin'
- Check backend returns role in login response
- Verify isAdmin hook returns true

## 📞 Support

If you encounter issues:

1. Check AUTHENTICATION_GUIDE.md for detailed docs
2. Verify backend responses with browser DevTools Network tab
3. Check localStorage for stored auth data
4. Review console logs for error messages

---

Good luck! 🎉
