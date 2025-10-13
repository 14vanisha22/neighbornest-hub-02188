-- Create storage bucket for lost and found item images
INSERT INTO storage.buckets (id, name, public)
VALUES ('lost-found-items', 'lost-found-items', true);

-- Create storage policies for lost-found-items bucket
CREATE POLICY "Anyone can view lost-found images"
ON storage.objects FOR SELECT
USING (bucket_id = 'lost-found-items');

CREATE POLICY "Authenticated users can upload lost-found images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'lost-found-items' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own lost-found images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'lost-found-items' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own lost-found images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'lost-found-items' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);