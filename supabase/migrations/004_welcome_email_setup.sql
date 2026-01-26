-- Create a function to track when users confirm their email
-- This will be used to trigger a welcome email

-- Create a table to track welcome emails sent
CREATE TABLE IF NOT EXISTS public.welcome_emails_sent (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sent_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on the table
ALTER TABLE public.welcome_emails_sent ENABLE ROW LEVEL SECURITY;

-- Create a policy so users can only see their own records
CREATE POLICY "Users can view their own welcome email status"
  ON public.welcome_emails_sent
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create a function to handle post-confirmation logic
CREATE OR REPLACE FUNCTION public.handle_user_email_confirmed()
RETURNS trigger AS $$
BEGIN
  -- Only proceed if email_confirmed_at was just set (not already set)
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    -- Insert a record to track that this user needs a welcome email
    INSERT INTO public.welcome_emails_sent (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    -- Note: The actual email sending will be handled by the application
    -- via a webhook or scheduled job that checks this table
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger on auth.users to detect email confirmation
-- Note: This requires superuser access and may not work in all Supabase environments
-- If it fails, you'll need to implement welcome emails in your application code instead
DO $$
BEGIN
  -- Try to create the trigger (may fail due to permissions)
  BEGIN
    DROP TRIGGER IF EXISTS on_user_email_confirmed ON auth.users;
    CREATE TRIGGER on_user_email_confirmed
      AFTER UPDATE ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_user_email_confirmed();
  EXCEPTION
    WHEN insufficient_privilege THEN
      -- If we don't have permission, that's okay - we'll handle it in the app
      RAISE NOTICE 'Could not create trigger on auth.users - will handle welcome emails in application code';
  END;
END $$;

-- Add a comment explaining the purpose
COMMENT ON TABLE public.welcome_emails_sent IS 'Tracks which users have been sent welcome emails after email confirmation';
