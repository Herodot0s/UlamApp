# Supabase Database Setup Guide

This guide will help you set up your Supabase database for UlamApp.

## Prerequisites

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project in your Supabase dashboard
3. Get your project URL and anon key from Project Settings > API

## Environment Variables

Create a `.env` file in the `ulamapp` directory (or add to your existing `.env` file):

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Database Schema

Run these SQL commands in your Supabase SQL Editor to create the required tables.

### 1. User Profiles Table

This table stores additional user profile information.

```sql
-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Create policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call function on new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 2. Saved Recipes Table

This table stores user's saved recipes.

```sql
-- Create saved_recipes table
CREATE TABLE IF NOT EXISTS saved_recipes (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id INTEGER NOT NULL,
  recipe_name TEXT NOT NULL,
  description TEXT,
  all_ingredients JSONB DEFAULT '[]'::jsonb,
  difficulty TEXT,
  prep_time TEXT,
  calories TEXT,
  estimated_cost TEXT,
  image_url TEXT,
  full_details JSONB NOT NULL,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, recipe_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_saved_recipes_user_id ON saved_recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_recipes_saved_at ON saved_recipes(saved_at DESC);

-- Enable Row Level Security
ALTER TABLE saved_recipes ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can view their own saved recipes
CREATE POLICY "Users can view own saved recipes"
  ON saved_recipes FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy: Users can insert their own saved recipes
CREATE POLICY "Users can insert own saved recipes"
  ON saved_recipes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can delete their own saved recipes
CREATE POLICY "Users can delete own saved recipes"
  ON saved_recipes FOR DELETE
  USING (auth.uid() = user_id);

-- Create policy: Users can update their own saved recipes
CREATE POLICY "Users can update own saved recipes"
  ON saved_recipes FOR UPDATE
  USING (auth.uid() = user_id);
```

## Verification

After running the SQL commands:

1. Go to **Table Editor** in your Supabase dashboard
2. You should see two tables: `user_profiles` and `saved_recipes`
3. Check that Row Level Security (RLS) is enabled for both tables
4. Verify the policies are created correctly

## Testing

1. Start your development server: `npm run dev`
2. Try registering a new user
3. Save a recipe
4. Check your Supabase dashboard to see the data being stored

## Notes

- **Row Level Security (RLS)**: All tables have RLS enabled to ensure users can only access their own data
- **Automatic Profile Creation**: When a user signs up, a profile is automatically created via the trigger function
- **Cascade Delete**: If a user is deleted, their profile and saved recipes are automatically deleted
- **Unique Constraint**: The `saved_recipes` table has a unique constraint on `(user_id, recipe_id)` to prevent duplicate saves

## Troubleshooting

### "relation does not exist" error
- Make sure you ran all SQL commands in the correct order
- Check that you're running them in the correct database

### "permission denied" error
- Verify that RLS policies are created correctly
- Check that the user is authenticated when making requests

### Data not appearing
- Check browser console for errors
- Verify environment variables are set correctly
- Check Supabase dashboard logs for API errors

