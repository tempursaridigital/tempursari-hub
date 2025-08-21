# Storage Bucket Setup Guide

## Issue
Error: `{"statusCode":"404","error":"Bucket not found","message":"Bucket not found"}`

This means the `service-documents` storage bucket doesn't exist or isn't configured properly.

## Solution Options

### Option 1: SQL Method (Recommended)
1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Run the `fix_storage_bucket.sql` script

### Option 2: Manual Method (If SQL doesn't work)
1. Go to your **Supabase Dashboard**
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"**
4. Configure the bucket:
   - **Name**: `service-documents`
   - **Public bucket**: ✅ **Enabled** (important!)
   - **File size limit**: `50 MB`
   - **Allowed MIME types**: 
     - `image/jpeg`
     - `image/jpg` 
     - `image/png`
     - `image/gif`
     - `image/webp`
     - `application/pdf`
5. Click **"Create bucket"**

### Option 3: Update Migration (For fresh setups)
If you're setting up from scratch, update the migration file:

```sql
-- In supabase/migrations/20250820021537_5bce6fad-52b7-4b61-a7d5-e36867ae05e1.sql
-- Change line 68 from:
INSERT INTO storage.buckets (id, name, public) VALUES ('service-documents', 'service-documents', false);

-- To:
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
    'service-documents', 
    'service-documents', 
    true, 
    52428800, 
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'image/jpg']
);
```

## Verification

After creating the bucket, verify it works:

1. **Check bucket exists**:
   ```sql
   SELECT * FROM storage.buckets WHERE name = 'service-documents';
   ```

2. **Test file upload** by submitting a service request with documents

3. **Check uploaded files**:
   ```sql
   SELECT name, bucket_id, created_at FROM storage.objects 
   WHERE bucket_id = 'service-documents' 
   ORDER BY created_at DESC;
   ```

## Troubleshooting

### If you still get bucket errors:
1. **Check bucket name** in the code matches exactly: `service-documents`
2. **Verify bucket is public** (required for image display)
3. **Check RLS policies** are properly set
4. **Try refreshing** your Supabase dashboard

### If images don't display:
1. **Ensure bucket is public** (most common issue)
2. **Check file permissions**
3. **Verify image URLs** in browser console

## Testing
After setup, test by:
1. Going to your app
2. Submitting a service request with image uploads
3. Checking the operator dashboard to see if images display properly
