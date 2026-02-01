-- Auto-create a business record when a new user signs up
-- This ensures every authenticated user has a business to work with

-- Create the trigger function
CREATE OR REPLACE FUNCTION public.create_business_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.b2b_businesses (name, owner_id, email)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'business_name', NEW.email),
    NEW.id,
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists (for idempotency)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_business_on_signup();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.b2b_businesses TO authenticated;
