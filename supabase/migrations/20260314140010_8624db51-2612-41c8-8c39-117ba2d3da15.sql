
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('drinks_images', 'drinks_images', false),
  ('event_posters', 'event_posters', false),
  ('event_gallery', 'event_gallery', false),
  ('event_videos', 'event_videos', false),
  ('dining_images', 'dining_images', false),
  ('venue_images', 'venue_images', false),
  ('hero_banners', 'hero_banners', false),
  ('awards_images', 'awards_images', false),
  ('partner_logos', 'partner_logos', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Admin can upload/manage
CREATE POLICY "Admin can manage all storage" ON storage.objects
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Public can read storage objects
CREATE POLICY "Public can read storage objects" ON storage.objects
  FOR SELECT TO public
  USING (true);

-- Create media_assets table
CREATE TABLE public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN ('drink', 'event_poster', 'event_gallery', 'event_video', 'dining_dish', 'venue_section', 'hero_banner', 'award', 'partner')),
  title TEXT,
  description TEXT,
  image_url TEXT,
  video_url TEXT,
  storage_bucket TEXT NOT NULL,
  storage_path TEXT,
  file_size INTEGER,
  file_format TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_hidden BOOLEAN NOT NULL DEFAULT false,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  uploaded_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage media_assets" ON public.media_assets
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view visible media_assets" ON public.media_assets
  FOR SELECT TO public
  USING (is_hidden = false);

-- Create drink_details table
CREATE TABLE public.drink_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id UUID NOT NULL REFERENCES public.media_assets(id) ON DELETE CASCADE,
  drink_name TEXT,
  brand TEXT,
  type TEXT,
  color TEXT,
  taste_notes TEXT,
  year_manufactured INTEGER,
  age TEXT,
  manufacturer TEXT,
  origin_country TEXT,
  distillery TEXT,
  alcohol_content NUMERIC,
  bottle_size TEXT,
  quality TEXT,
  price NUMERIC,
  provenance_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.drink_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage drink_details" ON public.drink_details
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view drink_details" ON public.drink_details
  FOR SELECT TO public
  USING (true);

-- Create event_media table
CREATE TABLE public.event_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE,
  poster_media_id UUID REFERENCES public.media_assets(id) ON DELETE SET NULL,
  gallery_media_ids JSONB DEFAULT '[]'::jsonb,
  video_media_ids JSONB DEFAULT '[]'::jsonb,
  venue_section TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.event_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage event_media" ON public.event_media
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view event_media" ON public.event_media
  FOR SELECT TO public
  USING (true);

-- Create dining_media table
CREATE TABLE public.dining_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id UUID REFERENCES public.media_assets(id) ON DELETE CASCADE,
  dish_name TEXT,
  chef TEXT,
  cuisine_type TEXT,
  ingredients TEXT,
  description TEXT,
  price NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.dining_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage dining_media" ON public.dining_media
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view dining_media" ON public.dining_media
  FOR SELECT TO public
  USING (true);

-- Create venue_media table
CREATE TABLE public.venue_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id UUID REFERENCES public.media_assets(id) ON DELETE CASCADE,
  venue_section_name TEXT,
  description TEXT,
  capacity INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.venue_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage venue_media" ON public.venue_media
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can view venue_media" ON public.venue_media
  FOR SELECT TO public
  USING (true);
