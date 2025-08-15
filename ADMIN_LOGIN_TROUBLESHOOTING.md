# 🔧 Admin Login Troubleshooting - Hostinger Deployment

## 🎯 **Your Deployed Site**
**URL:** https://lightcyan-shrew-995743.hostingersite.com/admin/login

---

## 🔍 **Common Login Issues & Solutions**

### **1. Environment Variables Missing**

**Problem:** Supabase connection not working
**Solution:** Check if environment variables are set in Hostinger

**In Hostinger Control Panel:**
1. Go to **Website** → **Manage**
2. Find **Environment Variables** section
3. Add these variables:
   ```
   VITE_SUPABASE_URL=https://oljdfzoxvxrkaaqpdijh.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. **Rebuild/Redeploy** your site

### **2. Admin User Not Created**

**Problem:** No admin user exists in Supabase
**Solution:** Create admin user in Supabase

**In Supabase Dashboard:**
1. Go to **Authentication** → **Users**
2. Click **Add User**
3. Create user with:
   - **Email:** `admin@habitat.com`
   - **Password:** `your-secure-password`
   - **Email Confirmed:** ✅ Yes

### **3. Admin Email Not in Allowed List**

**Problem:** User exists but not recognized as admin
**Solution:** Check admin email configuration

**In your code, verify this file exists:**
`src/lib/adminEmails.ts`
```typescript
export const adminEmails = [
  'admin@habitat.com',
  'your-email@domain.com'
];
```

### **4. RLS Policies Missing**

**Problem:** Database access blocked
**Solution:** Run RLS setup in Supabase

**In Supabase SQL Editor, run:**
```sql
-- Enable RLS on properties table
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to manage properties
CREATE POLICY "Authenticated can view all properties" ON properties
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can update properties" ON properties
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can insert properties" ON properties
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated can delete properties" ON properties
  FOR DELETE USING (auth.role() = 'authenticated');
```

---

## 🔧 **Step-by-Step Debugging**

### **Step 1: Check Browser Console**
1. Open your deployed site: https://lightcyan-shrew-995743.hostingersite.com/admin/login
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Look for errors like:
   - `Supabase URL is undefined`
   - `Network error`
   - `Authentication failed`

### **Step 2: Test Supabase Connection**
1. In browser console, type:
   ```javascript
   console.log(import.meta.env.VITE_SUPABASE_URL);
   console.log(import.meta.env.VITE_SUPABASE_ANON_KEY);
   ```
2. Should show your Supabase URL and key
3. If `undefined`, environment variables are missing

### **Step 3: Test Login Credentials**
Try logging in with:
- **Email:** `admin@habitat.com`
- **Password:** Your admin password

### **Step 4: Check Network Tab**
1. In Developer Tools, go to **Network** tab
2. Try to login
3. Look for failed requests to Supabase
4. Check response codes and error messages

---

## 🛠️ **Hostinger-Specific Setup**

### **Environment Variables in Hostinger**
1. **Login to Hostinger Control Panel**
2. **Go to Website → Manage**
3. **Find "Environment Variables" or "Build Settings"**
4. **Add:**
   ```
   VITE_SUPABASE_URL=https://oljdfzoxvxrkaaqpdijh.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### **Build Settings**
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Node Version:** 18 or higher

### **Redeploy After Changes**
After adding environment variables:
1. **Trigger a rebuild** in Hostinger
2. **Clear browser cache**
3. **Try login again**

---

## 🔍 **Quick Tests**

### **Test 1: Environment Variables**
Visit: https://lightcyan-shrew-995743.hostingersite.com
Open console and check if Supabase is defined.

### **Test 2: Supabase Connection**
Try accessing a public page first to see if basic Supabase connection works.

### **Test 3: Admin Route**
Make sure `/admin` routes are properly configured in your build.

---

## 🚨 **Most Likely Issues**

### **1. Missing Environment Variables (90% of cases)**
- Environment variables not set in Hostinger
- Wrong variable names (must start with `VITE_`)
- Need to rebuild after adding variables

### **2. Admin User Not Created (5% of cases)**
- No user with admin email exists in Supabase
- User exists but email not confirmed

### **3. RLS Policies Missing (5% of cases)**
- Database access blocked by Row Level Security
- Need to run RLS setup scripts

---

## 📞 **Next Steps**

1. **Check browser console** for errors
2. **Verify environment variables** in Hostinger
3. **Confirm admin user exists** in Supabase
4. **Run RLS scripts** if needed
5. **Share console errors** if still having issues

**Let me know what you see in the browser console and I'll help you fix it!** 🚀
