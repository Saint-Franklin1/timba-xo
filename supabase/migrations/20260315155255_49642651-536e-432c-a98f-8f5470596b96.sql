
CREATE TABLE public.drink_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  drink_id UUID REFERENCES public.drinks(id) ON DELETE SET NULL,
  drink_name TEXT NOT NULL,
  reservation_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.drink_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create drink bookings" ON public.drink_bookings
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Admins can manage drink bookings" ON public.drink_bookings
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view drink bookings" ON public.drink_bookings
  FOR SELECT TO public USING (public.has_role(auth.uid(), 'admin'));
