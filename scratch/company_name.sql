-- 1. Tambahkan kolom company_name di profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_name text;

-- 2. Perbarui fungsi handle_new_user untuk mengambil company_name dari metadata pendaftaran
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, is_verified, company_name)
  VALUES (
    new.id, 
    new.email, 
    'user', 
    false, 
    new.raw_user_meta_data->>'company_name'
  );
  RETURN new;
END;
$$;
