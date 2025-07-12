-- Create user role enum
CREATE TYPE public.app_role AS ENUM ('content_strategist', 'client');

-- Create user roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create client relationships table for strategists managing clients
CREATE TABLE public.client_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    strategist_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    accepted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (strategist_id, client_id)
);

-- Create client invitations table
CREATE TABLE public.client_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    strategist_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    email TEXT NOT NULL,
    client_name TEXT NOT NULL,
    invitation_token UUID DEFAULT gen_random_uuid(),
    status TEXT NOT NULL DEFAULT 'pending',
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days'),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for additional user info
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    company TEXT,
    role app_role,
    onboarding_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to check if user can access client data
CREATE OR REPLACE FUNCTION public.can_access_client_data(_user_id UUID, _client_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    -- User is the client themselves
    SELECT 1 WHERE _user_id = _client_id
    UNION
    -- User is a strategist managing this client
    SELECT 1
    FROM public.client_relationships
    WHERE strategist_id = _user_id 
      AND client_id = _client_id 
      AND status = 'active'
  )
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for client_relationships
CREATE POLICY "Strategists can view their client relationships"
ON public.client_relationships
FOR SELECT
TO authenticated
USING (
  auth.uid() = strategist_id OR 
  auth.uid() = client_id
);

CREATE POLICY "Strategists can create client relationships"
ON public.client_relationships
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = strategist_id AND
  public.has_role(auth.uid(), 'content_strategist')
);

CREATE POLICY "Strategists can update their client relationships"
ON public.client_relationships
FOR UPDATE
TO authenticated
USING (
  auth.uid() = strategist_id AND
  public.has_role(auth.uid(), 'content_strategist')
);

-- RLS Policies for client_invitations
CREATE POLICY "Strategists can manage their invitations"
ON public.client_invitations
FOR ALL
TO authenticated
USING (
  auth.uid() = strategist_id AND
  public.has_role(auth.uid(), 'content_strategist')
);

-- RLS Policies for profiles
CREATE POLICY "Users can view accessible profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() = id OR
  public.has_role(auth.uid(), 'content_strategist')
);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR ALL
TO authenticated
USING (auth.uid() = id);

-- Update existing tables to support client relationships
-- Update workspaces to support client ownership
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES auth.users(id);

-- Update personal_brands to support client ownership  
ALTER TABLE public.personal_brands ADD COLUMN IF NOT EXISTS client_id UUID;

-- Update content tables to support client relationships
ALTER TABLE public.content_pieces ADD COLUMN IF NOT EXISTS client_id UUID;
ALTER TABLE public.content_sources ADD COLUMN IF NOT EXISTS client_id UUID;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.email)
  );
  RETURN new;
END;
$$;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_relationships_updated_at
  BEFORE UPDATE ON public.client_relationships
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_invitations_updated_at
  BEFORE UPDATE ON public.client_invitations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();