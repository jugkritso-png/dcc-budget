-- migration.sql
-- Copy and paste this into your Supabase SQL Editor
-- This trigger automatically creates a profile in the "User" table whenever a new user signs up in Supabase Auth.

-- 1. Ensure public.User can use UUIDs matching auth.users
-- Your "User" table id must be of type UUID to match auth.users.id. If it's currently a text string, this trigger will still work if the text field can hold a UUID.

-- 2. Create the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public."User" (id, email, username, name, role, password, position, department)
  VALUES (
    new.id,
    new.email,
    SPLIT_PART(new.email, '@', 1), -- Basic username from email
    COALESCE(new.raw_user_meta_data->>'full_name', SPLIT_PART(new.email, '@', 1)),
    'user', -- Default role
    'supabase_auth_placeholder', -- Bypass NOT NULL password constraint
    'Staff', -- Default position
    'DCC' -- Default department
  );
  RETURN new;
END;
$$;

-- 3. Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
