-- Fix 1: Restrict profiles table access to prevent PII exposure
-- Drop the overly permissive policy that allows anyone to view all profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Allow users to view only their own profile
CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix 2: Add RLS policies for lost-found-items storage bucket
-- Allow users to upload only to their own folder
CREATE POLICY "Users can upload own files"
  ON storage.objects 
  FOR INSERT
  WITH CHECK (
    bucket_id = 'lost-found-items' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow public viewing of files (since lost/found items should be visible to all)
CREATE POLICY "Public can view lost-found items"
  ON storage.objects 
  FOR SELECT
  USING (bucket_id = 'lost-found-items');

-- Allow users to delete only their own files
CREATE POLICY "Users can delete own files"
  ON storage.objects 
  FOR DELETE
  USING (
    bucket_id = 'lost-found-items'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to update only their own files metadata
CREATE POLICY "Users can update own files"
  ON storage.objects 
  FOR UPDATE
  USING (
    bucket_id = 'lost-found-items'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );