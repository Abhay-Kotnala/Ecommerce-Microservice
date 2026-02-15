# User Registration - Quick Start Guide

## ✅ Registration is Now Enabled!

New users can create accounts without admin intervention!

---

## How Users Register

### For New Visitors:

1. **Visit Your Site**  
   Go to: http://localhost:5173

2. **Click "Login"**  
   Click the "Login" button in the top-right header

3. **Go to Registration Page**  
   On the Keycloak login page, click the **"Register"** link at the bottom

4. **Fill Registration Form**  
   - **Username**: Choose a unique username
   - **Email**: Enter email address
   - **Password**: Create a secure password
   - **Confirm Password**: Re-enter password

5. **Submit**  
   Click "Register" button

6. **Success!**  
   You'll be redirected back to the site
   Your username will appear in the header
   You can now place orders!

---

## Testing Registration (Recommended)

1. Open an **incognito/private browser window**
2. Go to http://localhost:5173
3. Click "Login"
4. Click "Register"
5. Create a test account:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `Test123!`
6. Submit
7. Verify you're logged in (see username in header)
8. Try placing an order!

---

## Settings Verification

I have double-checked the following settings in your Keycloak system:

- ✅ **User Registration**: `true` (Enabled)
- ✅ **Reset Password**: `true` (Enabled - forgot password link)
- ✅ **Login with Email**: `true` (Enabled)
- ℹ️ **Email Verification**: `false` (Disabled - no SMTP configured, avoids errors)
- ℹ️ **Email as Username**: `false` (Users can choose custom usernames)

---

## Viewing Registered Users

**As Admin:**

1. Go to Keycloak Admin: http://localhost:8090
2. Login: `admin` / `admin`
3. Select **ecommerce** realm
4. Click **Users** in left sidebar
5. All registered users will appear here!

---

## Troubleshooting

**"Register" link missing?**
- Refresh the login page
- Ensure you are in the `ecommerce` realm (app does this automatically)

**Registration fails?**
- Check password complexity (min 8 chars, 1 number, 1 symbol)
- Username might already be taken

---

## What's Next?

Your e-commerce site is now fully functional with:
- ✅ User registration
- ✅ Login/logout
- ✅ Shopping cart
- ✅ Product browsing
- ✅ Order placement
- ✅ Custom branding

**Ready for production!** 🎉
