-- 1. Tambahkan kolom owner_id yang mengarah ke tabel profiles
ALTER TABLE public.categories ADD COLUMN owner_id uuid references public.profiles(id);
ALTER TABLE public.locations ADD COLUMN owner_id uuid references public.profiles(id);
ALTER TABLE public.items ADD COLUMN owner_id uuid references public.profiles(id);
ALTER TABLE public.transactions ADD COLUMN owner_id uuid references public.profiles(id);

-- 2. Jadikan data lama sebagai milik Superadmin pertama agar tidak error
DO $$
DECLARE
  superadmin_id uuid;
BEGIN
  SELECT id INTO superadmin_id FROM public.profiles WHERE role = 'superadmin' LIMIT 1;
  IF superadmin_id IS NOT NULL THEN
    UPDATE public.categories SET owner_id = superadmin_id WHERE owner_id IS NULL;
    UPDATE public.locations SET owner_id = superadmin_id WHERE owner_id IS NULL;
    UPDATE public.items SET owner_id = superadmin_id WHERE owner_id IS NULL;
    UPDATE public.transactions SET owner_id = superadmin_id WHERE owner_id IS NULL;
  END IF;
END $$;

-- 3. Atur agar owner_id tidak boleh kosong, dan default-nya adalah user yang sedang login
ALTER TABLE public.categories ALTER COLUMN owner_id SET NOT NULL;
ALTER TABLE public.categories ALTER COLUMN owner_id SET DEFAULT auth.uid();

ALTER TABLE public.locations ALTER COLUMN owner_id SET NOT NULL;
ALTER TABLE public.locations ALTER COLUMN owner_id SET DEFAULT auth.uid();

ALTER TABLE public.items ALTER COLUMN owner_id SET NOT NULL;
ALTER TABLE public.items ALTER COLUMN owner_id SET DEFAULT auth.uid();

ALTER TABLE public.transactions ALTER COLUMN owner_id SET NOT NULL;
ALTER TABLE public.transactions ALTER COLUMN owner_id SET DEFAULT auth.uid();

-- 4. Aktifkan Row Level Security (RLS) di semua tabel
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- 5. Hapus Policy lama jika ada (mencegah bentrok)
DROP POLICY IF EXISTS "Enable all actions for everyone" ON public.categories;
DROP POLICY IF EXISTS "Enable all actions for everyone" ON public.locations;
DROP POLICY IF EXISTS "Enable all actions for everyone" ON public.items;
DROP POLICY IF EXISTS "Enable all actions for everyone" ON public.transactions;

-- 6. Buat Policy: User hanya melihat miliknya, Superadmin melihat semuanya
-- CATEGORIES
CREATE POLICY "Categories Policy" ON public.categories FOR ALL USING (
  owner_id = auth.uid() OR 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'superadmin'
);

-- LOCATIONS
CREATE POLICY "Locations Policy" ON public.locations FOR ALL USING (
  owner_id = auth.uid() OR 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'superadmin'
);

-- ITEMS
CREATE POLICY "Items Policy" ON public.items FOR ALL USING (
  owner_id = auth.uid() OR 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'superadmin'
);

-- TRANSACTIONS
CREATE POLICY "Transactions Policy" ON public.transactions FOR ALL USING (
  owner_id = auth.uid() OR 
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'superadmin'
);
