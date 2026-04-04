
CREATE TABLE public.booking_reference_counter (
  id integer PRIMARY KEY DEFAULT 1,
  ref_date date NOT NULL DEFAULT CURRENT_DATE,
  counter integer NOT NULL DEFAULT 0
);

ALTER TABLE public.booking_reference_counter ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage counter" ON public.booking_reference_counter FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public can read counter" ON public.booking_reference_counter FOR SELECT TO public USING (true);
CREATE POLICY "Public can update counter" ON public.booking_reference_counter FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public can insert counter" ON public.booking_reference_counter FOR INSERT TO public WITH CHECK (true);

INSERT INTO public.booking_reference_counter (id, ref_date, counter) VALUES (1, CURRENT_DATE, 0);

CREATE OR REPLACE FUNCTION public.generate_booking_reference()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ref text;
  next_num integer;
  today date := CURRENT_DATE;
BEGIN
  UPDATE booking_reference_counter
  SET counter = CASE WHEN ref_date = today THEN counter + 1 ELSE 1 END,
      ref_date = today
  WHERE id = 1
  RETURNING counter INTO next_num;

  IF next_num IS NULL THEN
    INSERT INTO booking_reference_counter (id, ref_date, counter) VALUES (1, today, 1)
    ON CONFLICT (id) DO UPDATE SET counter = 1, ref_date = today
    RETURNING counter INTO next_num;
  END IF;

  ref := 'TXO-' || to_char(today, 'YYYY') || '-' || lpad(next_num::text, 6, '0');
  RETURN ref;
END;
$$;

GRANT EXECUTE ON FUNCTION public.generate_booking_reference() TO anon, authenticated;
