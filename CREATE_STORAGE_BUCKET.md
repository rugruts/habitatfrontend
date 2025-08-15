# Create Storage Bucket for Property Images

## 🚨 **URGENT: Create Storage Buckets**

The image upload is failing because storage buckets don't exist. You need to create them manually:

## 🎯 **QUICKEST FIX** (Dashboard Method - Most Reliable)

**Just create ONE bucket manually:**

1. **Go to your Supabase project dashboard**
2. **Click "Storage"** in the left sidebar
3. **Click "Create bucket"**
4. **Enter these settings:**
   - **Name**: `property-images`
   - **Public**: ✅ **YES** (very important!)
   - **File size limit**: `10485760`
   - **Allowed MIME types**: `image/jpeg, image/png, image/webp`
5. **Click "Create bucket"**
6. **Refresh your browser** and try uploading images again

## 🔧 **Alternative: SQL Method**

If you prefer SQL:
1. **Go to SQL Editor** in your Supabase dashboard
2. **Copy the contents** of `QUICK_BUCKET_FIX.sql`
3. **Paste and run it**

## 📋 **Alternative: Manual Dashboard Creation**

If you prefer using the dashboard:

1. **Go to your Supabase project dashboard**
2. **Navigate to Storage** (in the left sidebar)
3. **Click "Create bucket"**
4. **Create these buckets:**

   **Bucket 1:**
   - **Name**: `property-images`
   - **Public**: ✅ Yes (check this box)
   - **File size limit**: `10485760` (10MB)
   - **Allowed MIME types**: `image/jpeg, image/png, image/webp`

   **Bucket 2:**
   - **Name**: `documents`
   - **Public**: ❌ No (uncheck this box)
   - **File size limit**: `10485760` (10MB)
   - **Allowed MIME types**: `image/jpeg, image/png, image/webp, application/pdf`

### Option 2: Create Buckets via SQL (Alternative)

If you prefer SQL, run this in your Supabase SQL Editor:

```sql
-- Create all required storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('property-images', 'property-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('documents', 'documents', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
  ('id-documents', 'id-documents', false, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('invoices', 'invoices', false, 5242880, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;
```

### Option 3: Quick Fix - Just Use Documents Bucket

The app already has a fallback mechanism! If the `property-images` bucket doesn't exist, it will automatically use the `documents` bucket. So you can:

1. **Skip creating the bucket for now**
2. **Test the property editor** - images will upload to the documents bucket
3. **Create the proper bucket later** when you have time

### What This Fixes

- ✅ **Image uploads** will work in the property editor
- ✅ **Drag and drop** functionality will work
- ✅ **Image reordering** will work
- ✅ **Fallback to documents bucket** if needed

### After Creating the Bucket

1. **Refresh your browser**
2. **Try uploading images** in the property editor
3. **Images should upload successfully** to the new bucket

### Troubleshooting

If you still get errors:
- The app has a **fallback mechanism** that uses the `documents` bucket
- Check that you're logged in as an admin user
- Verify the bucket was created successfully in the Storage section

---

**Note**: The property editor will automatically detect if the bucket exists and use it, or fall back to the documents bucket if needed.
