/*
  # Initial Schema Setup

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text, unique)
      - `created_at` (timestamp)
      - `streak_count` (integer)
      - `total_excuses` (integer)
    
    - `excuses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `workout_type` (text)
      - `excuse_text` (text)
      - `created_at` (timestamp)
      - `intensity` (text)
      - `duration` (integer)

    - `achievements`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `type` (text)
      - `achieved_at` (timestamp)
      - `description` (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users,
  username text UNIQUE,
  created_at timestamptz DEFAULT now(),
  streak_count integer DEFAULT 0,
  total_excuses integer DEFAULT 0
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create excuses table
CREATE TABLE excuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles,
  workout_type text NOT NULL,
  excuse_text text NOT NULL,
  created_at timestamptz DEFAULT now(),
  intensity text NOT NULL,
  duration integer NOT NULL,
  CONSTRAINT valid_intensity CHECK (intensity IN ('light', 'moderate', 'intense')),
  CONSTRAINT valid_duration CHECK (duration BETWEEN 1 AND 180)
);

ALTER TABLE excuses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own excuses"
  ON excuses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own excuses"
  ON excuses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create achievements table
CREATE TABLE achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles,
  type text NOT NULL,
  achieved_at timestamptz DEFAULT now(),
  description text NOT NULL
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own achievements"
  ON achievements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update streak count
CREATE OR REPLACE FUNCTION update_streak()
RETURNS TRIGGER AS $$
BEGIN
  -- Get the last excuse date for this user
  WITH last_excuse AS (
    SELECT created_at
    FROM excuses
    WHERE user_id = NEW.user_id
    ORDER BY created_at DESC
    LIMIT 1 OFFSET 1
  )
  UPDATE profiles
  SET 
    streak_count = CASE 
      WHEN (SELECT created_at FROM last_excuse) >= CURRENT_DATE - INTERVAL '1 day'
      THEN streak_count + 1
      ELSE 1
    END,
    total_excuses = total_excuses + 1
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for streak updates
CREATE TRIGGER update_streak_trigger
AFTER INSERT ON excuses
FOR EACH ROW
EXECUTE FUNCTION update_streak();