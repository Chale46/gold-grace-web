# Strategy Photos Setup Guide

## Overview
This feature allows admins to upload up to 6 strategy photos that will display in a carousel on the home page's "Strategi Disesuaikan" section.

## Setup Steps

### 1. Create Supabase Storage Bucket

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Navigate to **Storage** → **Buckets**
3. Click **Create a new bucket**
4. Set the following:
   - **Name**: `strategy-photos`
   - **Public bucket**: YES (toggle on)
   - Click **Create bucket**

### 2. Run Database Migration

1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Copy the SQL from `STRATEGY_PHOTOS_MIGRATION.sql`
4. Paste it into the SQL editor
5. Click **Run**

This creates:
- `strategy_photos` table with columns: `id`, `url`, `order`, `uploaded_at`, `created_at`
- RLS (Row Level Security) policies for public read and authenticated write access
- Indexes for better query performance

### 3. Verify Setup

After running the migration, verify:
- Table exists: Check in **Table Editor** → should see `strategy_photos`
- Storage bucket exists: Check in **Storage** → should see `strategy-photos` bucket
- RLS policies are active (should show 4 policies in the table settings)

## Admin Features

### Accessing the Admin Panel
1. Go to `jadtraconsulting.com/admin`
2. Login with your admin credentials
3. Click **Foto Strategi** in the sidebar

### Uploading Photos
- Click the upload area or drag-and-drop images
- Supported formats: JPG, PNG
- Max file size: 5MB per photo
- Max total photos: 6

### Managing Photos
- **Reorder**: Drag and drop photos to change display order
- **Delete**: Hover over a photo and click the trash icon
- **View**: Photos display in order (1, 2, 3, etc.)

### Photo Display

The photos will automatically display on the home page:
- **Single photo**: Shows the photo directly (no carousel)
- **Multiple photos**: Shows carousel with:
  - Auto-rotation every 5 seconds
  - Navigation arrows on hover
  - Dot indicators at the bottom
  - Photo counter (e.g., "1 / 6")
  - Smooth fade transitions between photos

If no photos are uploaded, the default placeholder with the Target icon will display.

## Frontend Integration

### Components Used
- `AdminStrategyPhotos.tsx`: Admin management page
- `StrategyPhotoGallery.tsx`: Public carousel display
- `SiteContentProvider.tsx`: Fetches photos on app startup
- `Index.tsx`: Home page that displays the gallery

### Hooks
- `useSiteContent()`: Provides `strategyPhotos` data to components

## Database Schema

```sql
strategy_photos {
  id: TEXT (primary key)
  url: TEXT (photo URL from storage)
  order: INTEGER (display order, 0-5)
  uploaded_at: TIMESTAMP
  created_at: TIMESTAMP
}
```

## Troubleshooting

### Photos not showing
- Check if `strategy-photos` bucket exists in Storage
- Verify RLS policies are enabled
- Clear browser cache and refresh

### Upload fails
- Ensure file is under 5MB
- Ensure file is an image (JPG, PNG)
- Ensure storage bucket is public

### Can't access admin page
- Verify you're logged in
- Check authentication token is valid
- Try logging out and in again

## Notes
- Photos are stored in Supabase Storage (not in database)
- Database stores only the URL and metadata
- Storage bucket must be public for photos to display
- Max 6 photos limit is enforced in the frontend
