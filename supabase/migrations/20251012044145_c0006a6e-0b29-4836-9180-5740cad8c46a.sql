
-- Create call_history table to track user calls to medical centers
CREATE TABLE public.call_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  medical_center_id UUID,
  medical_center_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  call_type TEXT NOT NULL DEFAULT 'regular', -- 'regular' or 'emergency'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.call_history ENABLE ROW LEVEL SECURITY;

-- Users can view their own call history
CREATE POLICY "Users can view own call history"
ON public.call_history
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own call history
CREATE POLICY "Users can insert own call history"
ON public.call_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX idx_call_history_user_id ON public.call_history(user_id);
CREATE INDEX idx_call_history_created_at ON public.call_history(created_at DESC);
