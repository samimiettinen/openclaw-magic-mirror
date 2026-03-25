
-- Create decks table
CREATE TABLE public.decks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Untitled Deck',
  subtitle text DEFAULT '',
  slug text,
  description text DEFAULT '',
  theme text DEFAULT 'default',
  status text DEFAULT 'draft',
  cover_image_url text,
  tags text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create deck_slides table
CREATE TABLE public.deck_slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id uuid NOT NULL REFERENCES public.decks(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Untitled Slide',
  section_label text DEFAULT '',
  slide_type text NOT NULL DEFAULT 'hero',
  order_index integer NOT NULL DEFAULT 0,
  content jsonb NOT NULL DEFAULT '{}',
  notes text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deck_slides ENABLE ROW LEVEL SECURITY;

-- RLS policies for decks
CREATE POLICY "Users can view own decks" ON public.decks FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create own decks" ON public.decks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own decks" ON public.decks FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own decks" ON public.decks FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RLS policies for deck_slides (via deck ownership)
CREATE POLICY "Users can view slides of own decks" ON public.deck_slides FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.decks WHERE decks.id = deck_slides.deck_id AND decks.user_id = auth.uid()));
CREATE POLICY "Users can create slides in own decks" ON public.deck_slides FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.decks WHERE decks.id = deck_slides.deck_id AND decks.user_id = auth.uid()));
CREATE POLICY "Users can update slides in own decks" ON public.deck_slides FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.decks WHERE decks.id = deck_slides.deck_id AND decks.user_id = auth.uid()));
CREATE POLICY "Users can delete slides in own decks" ON public.deck_slides FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.decks WHERE decks.id = deck_slides.deck_id AND decks.user_id = auth.uid()));

-- Indexes
CREATE INDEX idx_deck_slides_order ON public.deck_slides(deck_id, order_index);
CREATE INDEX idx_decks_user ON public.decks(user_id, updated_at DESC);
