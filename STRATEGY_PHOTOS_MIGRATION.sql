-- Create strategy_photos table
CREATE TABLE IF NOT EXISTS strategy_photos (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  url TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS policies
ALTER TABLE strategy_photos ENABLE ROW LEVEL SECURITY;

-- Policy for public read access
CREATE POLICY "Allow public read access" ON strategy_photos
  FOR SELECT
  USING (true);

-- Policy for authenticated users to insert
CREATE POLICY "Allow authenticated insert" ON strategy_photos
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy for authenticated users to update
CREATE POLICY "Allow authenticated update" ON strategy_photos
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Policy for authenticated users to delete
CREATE POLICY "Allow authenticated delete" ON strategy_photos
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Create index on order for faster sorting
CREATE INDEX idx_strategy_photos_order ON strategy_photos("order" ASC);

-- Create index on created_at for faster queries
CREATE INDEX idx_strategy_photos_created_at ON strategy_photos(created_at DESC);
