# 🔧 Hostinger Deployment Fix - Environment Variables

## 🎯 **The Issue**
Hostinger shared hosting doesn't support runtime environment variables for static React sites. You need to build with environment variables **locally** then upload the built files.

---

## ✅ **Solution: Build Locally with Environment Variables**

### **Step 1: Create .env File**
In your project root directory, create a `.env` file:

```env
VITE_SUPABASE_URL=https://oljdfzoxvxrkaaqpdijh.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

**⚠️ Important:** Replace `your-actual-anon-key-here` with your real Supabase anon key from your Supabase dashboard.

### **Step 2: Get Your Supabase Keys**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** (for VITE_SUPABASE_URL)
   - **anon public key** (for VITE_SUPABASE_ANON_KEY)

### **Step 3: Build with Environment Variables**
```bash
# Make sure .env file is in your project root
npm run build
```

This will create a `dist` folder with your built files that include the environment variables.

### **Step 4: Upload to Hostinger**
1. **Zip the dist folder contents** (not the dist folder itself)
2. **Upload to Hostinger File Manager**
3. **Extract in your public_html directory**

---

## 📁 **Correct File Structure on Hostinger**

Your Hostinger `public_html` should look like:
```
public_html/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [image files]
└── [other built files]
```

**NOT:**
```
public_html/
└── dist/
    ├── index.html
    └── assets/
```

---

## 🔧 **Step-by-Step Fix**

### **1. Local Setup**
```bash
# In your project directory
echo "VITE_SUPABASE_URL=https://oljdfzoxvxrkaaqpdijh.supabase.co" > .env
echo "VITE_SUPABASE_ANON_KEY=your-actual-key" >> .env

# Build the project
npm run build
```

### **2. Upload Process**
1. **Go to Hostinger File Manager**
2. **Navigate to public_html**
3. **Delete existing files** (backup first if needed)
4. **Upload contents of dist folder** (not the dist folder itself)
5. **Extract files directly in public_html**

### **3. Test the Fix**
1. Visit: https://lightcyan-shrew-995743.hostingersite.com
2. Open browser console (F12)
3. Type: `console.log('Environment check')`
4. Try admin login again

---

## 🔍 **Verification Steps**

### **Before Building (Local)**
```bash
# Check if .env file exists
cat .env

# Should show:
# VITE_SUPABASE_URL=https://oljdfzoxvxrkaaqpdijh.supabase.co
# VITE_SUPABASE_ANON_KEY=your-key-here
```

### **After Building**
```bash
# Check if build was successful
ls dist/

# Should show:
# index.html  assets/  [other files]
```

### **After Upload**
Visit your site and check browser console for Supabase connection.

---

## 🚨 **Common Mistakes to Avoid**

### **❌ Wrong:**
- Uploading the `dist` folder itself
- Missing `.env` file before building
- Wrong environment variable names (must start with `VITE_`)
- Uploading without rebuilding after .env changes

### **✅ Correct:**
- Upload **contents** of dist folder
- Create `.env` file with correct variables
- Build locally with `npm run build`
- Upload built files to public_html root

---

## 🔑 **Get Your Supabase Keys**

If you don't have your Supabase keys:

1. **Go to:** https://supabase.com/dashboard
2. **Select your project**
3. **Settings** → **API**
4. **Copy:**
   - Project URL: `https://oljdfzoxvxrkaaqpdijh.supabase.co`
   - anon public key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 🚀 **Quick Fix Commands**

```bash
# 1. Create .env file (replace with your actual key)
echo "VITE_SUPABASE_URL=https://oljdfzoxvxrkaaqpdijh.supabase.co" > .env
echo "VITE_SUPABASE_ANON_KEY=your-actual-supabase-anon-key" >> .env

# 2. Build with environment variables
npm run build

# 3. The dist folder now contains your built files with embedded environment variables
# 4. Upload CONTENTS of dist folder to Hostinger public_html
# 5. Test your admin login
```

---

## 📞 **Next Steps**

1. **Create .env file** with your Supabase credentials
2. **Build locally** with `npm run build`
3. **Upload dist contents** to Hostinger public_html
4. **Test admin login** again

**Once you do this, your admin login should work perfectly!** 🎉

**Need help getting your Supabase keys or have questions about the upload process?** Let me know! 🚀
