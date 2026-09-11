# Testing Checklist - Authentication & RBAC System

Use this checklist to verify all authentication and role-based access control features are working correctly.

## ✅ Pre-Testing Setup

- [ ] Backend is running on http://localhost:3000
- [ ] Frontend is running on http://localhost:5173
- [ ] Backend auth endpoints are implemented
- [ ] Backend book endpoints are implemented
- [ ] CORS is enabled on backend
- [ ] API responds with correct format

## ✅ Authentication Tests

### Registration Page

- [ ] Navigate to `/register` works
- [ ] Can enter name, email, password, confirm password
- [ ] Password validation shows error if < 6 characters
- [ ] Passwords must match error works
- [ ] Successful registration redirects to login
- [ ] Error message shows if email already exists

### Login Page

- [ ] Navigate to `/login` works
- [ ] Can enter email and password
- [ ] Successful login redirects to `/books`
- [ ] Token stored in localStorage (`authToken`)
- [ ] User data stored in localStorage (`authUser`)
- [ ] Error message shows for invalid credentials
- [ ] Login persists after page reload

### Logout

- [ ] Logout button visible in navbar
- [ ] Click logout removes from `/books` page
- [ ] Redirects to login page
- [ ] localStorage cleared (authToken and authUser removed)
- [ ] Cannot access protected routes after logout

## ✅ Route Protection Tests

### Public Routes

- [ ] Can access `/` (HomePage) without login
- [ ] Can access `/login` without login
- [ ] Can access `/register` without login

### Protected Routes (User & Admin)

- [ ] Cannot access `/books` without login → redirects to `/login`
- [ ] Cannot access `/books/:id` without login → redirects to `/login`
- [ ] Cannot access `/profile` without login → redirects to `/login`
- [ ] Can access after login

### Admin Routes (Admin Only)

- [ ] Cannot access `/admin/books/add` without login → redirects to `/login`
- [ ] Cannot access `/admin/books/edit/:id` without login → redirects to `/login`
- [ ] Non-admin accessing `/admin/books/add` → redirects to `/forbidden`
- [ ] Non-admin accessing `/admin/books/edit/:id` → redirects to `/forbidden`
- [ ] Admin can access both routes

### Error Routes

- [ ] Can access `/forbidden` page (403 error)
- [ ] Can access invalid route shows 404

## ✅ Navigation Bar Tests

### Unauthenticated User

- [ ] Navbar shows "📚 Book Management" title
- [ ] Navbar shows "Login" link
- [ ] Navbar shows "Register" link
- [ ] No logout button
- [ ] No user info displayed

### Authenticated User (Regular)

- [ ] Navbar shows "📚 Book Management" title
- [ ] Navbar shows "📖 Books" link
- [ ] Navbar shows "👤 Profile" link
- [ ] Navbar shows "Logout" button
- [ ] Navbar shows user name
- [ ] Navbar shows user role "(user)"
- [ ] "➕ Add Book" link NOT visible

### Authenticated Admin

- [ ] Navbar shows "📚 Book Management" title
- [ ] Navbar shows "📖 Books" link
- [ ] Navbar shows "➕ Add Book" link
- [ ] Navbar shows "👤 Profile" link
- [ ] Navbar shows "Logout" button
- [ ] Navbar shows user name
- [ ] Navbar shows user role "(admin)"

## ✅ Books Page Tests

### Display

- [ ] Books load and display in grid
- [ ] Shows loading state initially
- [ ] Shows error message if API fails
- [ ] Shows "No books available" if empty

### Book Card - Regular User

- [ ] Shows book image, title, author, category, rating, year
- [ ] Shows "👁️ View" button
- [ ] Does NOT show "✏️ Edit" button
- [ ] Does NOT show "🗑️ Delete" button
- [ ] Click "View" → goes to `/books/:id`

### Book Card - Admin

- [ ] Shows book image, title, author, category, rating, year
- [ ] Shows "👁️ View" button
- [ ] Shows "✏️ Edit" button
- [ ] Shows "🗑️ Delete" button
- [ ] Click "View" → goes to `/books/:id`
- [ ] Click "Edit" → goes to `/admin/books/edit/:id`
- [ ] Click "Delete" → shows confirmation, deletes book

## ✅ Book Details Page Tests

### Display

- [ ] Page loads with book information
- [ ] Shows book image prominently
- [ ] Shows all book details (title, author, category, year, rating, description)
- [ ] Shows "← Back to Books" button

### User Actions

- [ ] Regular user sees only "← Back to Books" button
- [ ] Admin sees "← Back to Books" button
- [ ] Admin sees "✏️ Edit" button
- [ ] Admin sees "🗑️ Delete" button

### Actions

- [ ] Click "← Back to Books" → goes to `/books`
- [ ] Click "Edit" (admin) → goes to edit page
- [ ] Click "Delete" (admin) → shows confirmation
- [ ] Confirm delete → book removed, redirects to `/books`

## ✅ Add Book Page (Admin Only) Tests

### Access Control

- [ ] Non-admin cannot access → redirects to `/forbidden`
- [ ] Admin can access → loads form

### Form

- [ ] Can enter title
- [ ] Can enter author
- [ ] Can enter category
- [ ] Can enter year
- [ ] Can enter rating (0-10)
- [ ] Can enter image URL
- [ ] Can enter description
- [ ] "Add Book" button visible

### Submission

- [ ] Validation works (required fields)
- [ ] Successful submission → redirected to `/books`
- [ ] Book appears in books list
- [ ] Error message shown if API fails

### Cancel

- [ ] "Cancel" button visible
- [ ] Click Cancel → goes to `/books` without saving

## ✅ Edit Book Page (Admin Only) Tests

### Access Control

- [ ] Non-admin cannot access → redirects to `/forbidden`
- [ ] Admin can access → form pre-populated

### Form Pre-Population

- [ ] Title field shows current value
- [ ] Author field shows current value
- [ ] Category field shows current value
- [ ] Year field shows current value
- [ ] Rating field shows current value
- [ ] Image URL field shows current value
- [ ] Description field shows current value

### Submission

- [ ] Can modify all fields
- [ ] Successful update → redirected to book details page
- [ ] Book shows updated information
- [ ] Error message shown if API fails

### Cancel

- [ ] "Cancel" button visible
- [ ] Click Cancel → goes back to book details without saving

## ✅ Profile Page Tests

### Display

- [ ] Accessible at `/profile`
- [ ] Shows user name
- [ ] Shows user email
- [ ] Shows user role
- [ ] Shows account creation date
- [ ] Role badge styled correctly

### Role Display

- [ ] Regular user shows "👤 User" badge
- [ ] Admin shows "👑 Administrator" badge

### Navigation

- [ ] Can navigate from navbar
- [ ] Can go back to books from navbar

## ✅ API Integration Tests

### Token Management

- [ ] Token included in all authenticated requests
- [ ] Authorization header format: `Bearer {token}`
- [ ] Token sent in localStorage
- [ ] Token removed on logout

### API Calls

- [ ] GET `/api/books` works and returns books
- [ ] GET `/api/books/:id` works and returns book
- [ ] POST `/api/books` works (admin) and creates book
- [ ] PUT `/api/books/:id` works (admin) and updates book
- [ ] DELETE `/api/books/:id` works (admin) and deletes book

### Error Handling

- [ ] 401 Unauthorized → shows error message
- [ ] 403 Forbidden (admin route) → shows error message
- [ ] 404 Not Found → shows error message
- [ ] Network error → shows error message

## ✅ Browser Storage Tests

### localStorage

- [ ] After login, check localStorage has:
  - [ ] `authToken` (JWT token)
  - [ ] `authUser` (JSON user object)
- [ ] After logout, check localStorage is cleared:
  - [ ] `authToken` removed
  - [ ] `authUser` removed

### Page Reload

- [ ] Login to app
- [ ] Refresh page (F5)
- [ ] Still logged in (no redirect to login)
- [ ] User info still visible in navbar

## ✅ Edge Cases & Error Handling

### Invalid Inputs

- [ ] Empty login form shows validation error
- [ ] Invalid email format shows error
- [ ] Very long inputs handled correctly
- [ ] Special characters in inputs handled

### Session Expiration

- [ ] Logout clears session
- [ ] Manual localStorage clear logs out user
- [ ] Token expiration (if implemented) logs out user

### Network Issues

- [ ] Failed login shows error message
- [ ] Failed book fetch shows error message
- [ ] Retry attempts work

### Concurrent Operations

- [ ] Rapid clicks don't cause errors
- [ ] Form submission disabled while loading
- [ ] Delete confirmation prevents accidental deletes

## ✅ Mobile/Responsive Tests

### Layout

- [ ] Navbar responsive on mobile
- [ ] Books grid adjusts on mobile
- [ ] Forms readable on mobile
- [ ] Buttons clickable on mobile

### Touch

- [ ] Touch/click buttons works
- [ ] Forms fillable on mobile
- [ ] Navigation works on mobile

## ✅ Cross-Browser Tests

- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## ✅ Performance Tests

- [ ] Login/register response time < 3s
- [ ] Books page loads within 2s
- [ ] No console errors
- [ ] No network errors
- [ ] Smooth animations/transitions

## 🐛 Debugging Checklist

If tests fail, check:

- [ ] Browser console for JavaScript errors
- [ ] Network tab for failed API requests
- [ ] localStorage for token/user data
- [ ] Backend logs for errors
- [ ] API response format matches contract
- [ ] CORS headers correct
- [ ] User role returned from backend
- [ ] Routes properly protected
- [ ] Components properly imported

## 📝 Notes

Use this space to record any issues found:

```
Issue 1:
Expected:
Actual:
Solution:

Issue 2:
Expected:
Actual:
Solution:
```

---

**Testing Status: Complete ✅** (when all items checked)

Date Completed: ******\_\_\_******
Tested By: ******\_\_\_******
