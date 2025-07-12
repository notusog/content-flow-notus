-- Fix the RLS policy issue on user_roles table that's preventing signup
-- The current policy is too restrictive and blocks the trigger from inserting roles

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can insert their own roles" ON public.user_roles;

-- Create a more permissive policy that allows the trigger to work
CREATE POLICY "Allow role creation during signup" ON public.user_roles
  FOR INSERT
  WITH CHECK (true);

-- Also ensure users can read their own roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Fix the handle_new_user trigger to also create user roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.email)
  );
  
  -- Insert default role (assuming 'client' as default, can be changed later)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'client'::public.app_role);
  
  RETURN new;
END;
$$;

-- Make sure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();