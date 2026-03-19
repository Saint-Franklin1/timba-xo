-- Make all storage buckets public for reliable image URLs
UPDATE storage.buckets SET public = true WHERE id IN (
  'drinks_images',
  'event_posters',
  'event_gallery',
  'event_videos',
  'dining_images',
  'venue_images',
  'hero_banners',
  'awards_images',
  'partner_logos'
);

-- Allow public read access to all objects in these buckets
CREATE POLICY "Public read access for all buckets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id IN (
  'drinks_images', 'event_posters', 'event_gallery', 'event_videos',
  'dining_images', 'venue_images', 'hero_banners', 'awards_images', 'partner_logos'
));