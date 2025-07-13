-- Create missing profile for the user
INSERT INTO public.profiles (id, email, full_name, onboarding_completed)
VALUES (
  '635af801-4e37-4bd5-9fd7-73bb4e1b3095',
  'marvin@notus.xyz',
  'marvin sangines',
  true
);

-- Set user role as content strategist
INSERT INTO public.user_roles (user_id, role)
VALUES (
  '635af801-4e37-4bd5-9fd7-73bb4e1b3095',
  'content_strategist'::public.app_role
);