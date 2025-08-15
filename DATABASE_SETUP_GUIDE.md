# Database Setup Guide - Step by Step

## 🎯 **Quick Setup (Recommended)**

### **Option 1: All-in-One Script**
Run `ADD_MISSING_PROPERTY_FIELDS.sql` in your Supabase SQL Editor.

If you get any errors, use Option 2 below.

---

## 🔧 **Step-by-Step Setup (If Option 1 Fails)**

### **Step 1: Add Columns**
Run `SIMPLE_ADD_COLUMNS.sql` first:
```sql
-- This adds all the missing columns
ALTER TABLE properties ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS size_sqm INTEGER;
-- ... etc
```

### **Step 2: Update Default Values**
Then run `UPDATE_DEFAULT_VALUES.sql`:
```sql
-- This populates existing properties with default values
UPDATE properties SET slug = LOWER(REPLACE(name, ' ', '-')) WHERE slug IS NULL;
UPDATE properties SET size_sqm = 50 WHERE size_sqm IS NULL;
-- ... etc
```

---

## ✅ **Verification**

After running the scripts, you should see these new columns in your properties table:

| Column | Type | Purpose |
|--------|------|---------|
| `slug` | TEXT | URL-friendly property name |
| `size_sqm` | INTEGER | Property size in square meters |
| `cleaning_fee` | INTEGER | Cleaning fee in cents |
| `security_deposit` | INTEGER | Security deposit in cents |
| `min_nights` | INTEGER | Minimum stay duration |
| `max_nights` | INTEGER | Maximum stay duration |
| `check_in_time` | TEXT | Check-in time (e.g., "15:00") |
| `check_out_time` | TEXT | Check-out time (e.g., "11:00") |
| `about_space` | TEXT | "About This Space" content |
| `the_space` | TEXT | "The Space" content |
| `location_neighborhood` | TEXT | "Location & Neighborhood" content |
| `house_rules` | TEXT | "House Rules" content |

---

## 🚀 **Test the System**

1. **Refresh your admin panel**
2. **Edit a property** - you should see all the new fields
3. **Use the professional icon interface** to build content
4. **Save and view the live property page** - all sections should be editable

---

## 🔍 **Troubleshooting**

### **If you get "column already exists" errors:**
- This is normal - the `IF NOT EXISTS` clause handles this
- The script will skip existing columns and continue

### **If you get syntax errors:**
- Use the step-by-step approach (Option 2)
- Run one script at a time
- Check the Supabase logs for specific error details

### **If the admin interface doesn't show new fields:**
- Hard refresh your browser (Ctrl+F5 or Cmd+Shift+R)
- Check browser console for any JavaScript errors
- Verify the database columns were actually added

---

## 📋 **What Each Script Does**

### **ADD_MISSING_PROPERTY_FIELDS.sql**
- Adds all missing columns
- Sets up default values
- Includes verification queries
- One-stop solution

### **SIMPLE_ADD_COLUMNS.sql**
- Just adds the columns
- No data updates
- Safe fallback option

### **UPDATE_DEFAULT_VALUES.sql**
- Populates existing properties with defaults
- Only updates NULL or empty values
- Includes verification query

---

## ✅ **Success Indicators**

You'll know it worked when:
- ✅ No SQL errors in Supabase
- ✅ New fields appear in the property editor
- ✅ Professional icons are visible
- ✅ Template buttons work
- ✅ Content appears on live property pages
- ✅ All 4 content sections are editable

**Ready to build professional property listings with just clicks!** 🎉
