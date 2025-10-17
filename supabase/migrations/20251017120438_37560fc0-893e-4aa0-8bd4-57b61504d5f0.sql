-- Create comments table for event discussions
CREATE TABLE IF NOT EXISTS public.event_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on event_comments
ALTER TABLE public.event_comments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies on event_comments if they exist
DROP POLICY IF EXISTS "Anyone can view comments" ON public.event_comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.event_comments;
DROP POLICY IF EXISTS "Users can update own comments" ON public.event_comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON public.event_comments;

-- RLS policies for event_comments
CREATE POLICY "Anyone can view comments"
  ON public.event_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON public.event_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON public.event_comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON public.event_comments FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for event_comments updated_at
DROP TRIGGER IF EXISTS update_event_comments_updated_at ON public.event_comments;
CREATE TRIGGER update_event_comments_updated_at
  BEFORE UPDATE ON public.event_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update existing surveys table to add more fields
ALTER TABLE public.surveys ADD COLUMN IF NOT EXISTS questions JSONB;
ALTER TABLE public.surveys ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT false;
ALTER TABLE public.surveys ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

-- Update problem_reports table to add upvotes tracking
ALTER TABLE public.problem_reports ADD COLUMN IF NOT EXISTS upvotes INTEGER DEFAULT 0;

-- Create problem_upvotes table to track who upvoted what
CREATE TABLE IF NOT EXISTS public.problem_upvotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id UUID NOT NULL REFERENCES public.problem_reports(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(problem_id, user_id)
);

-- Enable RLS on problem_upvotes
ALTER TABLE public.problem_upvotes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies on problem_upvotes if they exist
DROP POLICY IF EXISTS "Upvotes viewable by everyone" ON public.problem_upvotes;
DROP POLICY IF EXISTS "Authenticated users can upvote" ON public.problem_upvotes;

-- RLS policies for problem_upvotes
CREATE POLICY "Upvotes viewable by everyone"
  ON public.problem_upvotes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can upvote"
  ON public.problem_upvotes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to update problem upvote count
CREATE OR REPLACE FUNCTION public.update_problem_upvote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE problem_reports 
    SET upvotes = upvotes + 1
    WHERE id = NEW.problem_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE problem_reports 
    SET upvotes = GREATEST(upvotes - 1, 0)
    WHERE id = OLD.problem_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to update problem upvote count
DROP TRIGGER IF EXISTS update_problem_upvotes_count ON public.problem_upvotes;
CREATE TRIGGER update_problem_upvotes_count
  AFTER INSERT OR DELETE ON public.problem_upvotes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_problem_upvote_count();