-- Create account deletion requests table
CREATE TABLE IF NOT EXISTS public.account_deletion_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.account_deletion_requests ENABLE ROW LEVEL SECURITY;

-- Create policy so users can only see their own deletion requests
CREATE POLICY "Users can view their own deletion requests"
  ON public.account_deletion_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_account_deletion_token ON public.account_deletion_requests(token);
CREATE INDEX IF NOT EXISTS idx_account_deletion_expires ON public.account_deletion_requests(expires_at);

-- Create a function to clean up expired deletion requests
CREATE OR REPLACE FUNCTION public.cleanup_expired_deletion_requests()
RETURNS void AS $$
BEGIN
  DELETE FROM public.account_deletion_requests
  WHERE expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment
COMMENT ON TABLE public.account_deletion_requests IS 'Tracks pending account deletion requests with time-limited tokens';
