# Trending Recipes Database Setup

This guide will help you set up the database table for tracking trending recipes.

## Database Schema

Run this SQL command in your Supabase SQL Editor to create the `recipe_views` table:

```sql
-- Create recipe_views table to track recipe views for trending
CREATE TABLE IF NOT EXISTS recipe_views (
  id BIGSERIAL PRIMARY KEY,
  recipe_id INTEGER NOT NULL,
  recipe_name TEXT NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_recipe_views_recipe_id ON recipe_views(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_views_viewed_at ON recipe_views(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_recipe_views_recipe_name ON recipe_views(recipe_name);

-- Enable Row Level Security (optional - you can make this public for trending)
ALTER TABLE recipe_views ENABLE ROW LEVEL SECURITY;

-- Create policy: Anyone can insert views (for tracking)
CREATE POLICY "Anyone can track recipe views"
  ON recipe_views FOR INSERT
  WITH CHECK (true);

-- Create policy: Anyone can view recipe views (for trending calculation)
CREATE POLICY "Anyone can view recipe views"
  ON recipe_views FOR SELECT
  USING (true);
```

## How It Works

1. **Tracking**: Every time a user views a recipe, a record is inserted into `recipe_views`
2. **Trending Calculation**: The app queries the most viewed recipes in the last 7 days
3. **Display**: Top 6 recipes by view count are shown in the "Trending Now" section

## Notes

- Views are tracked anonymously (no user_id required)
- Trending is calculated based on views in the last 7 days
- If no trending data exists, the app falls back to featured recipes
- The system is non-blocking - if tracking fails, it won't break the app

## Verification

After running the SQL:

1. Go to **Table Editor** in your Supabase dashboard
2. You should see the `recipe_views` table
3. As users view recipes, you'll see records appear in this table
4. The trending section will automatically update based on view counts

