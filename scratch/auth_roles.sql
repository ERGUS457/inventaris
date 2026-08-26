-- 1. Buat tabel Profiles untuk menyimpan Role dan Status Verifikasi
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  role text not null default 'user',
  is_verified boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Aktifkan Row Level Security (RLS)
alter table public.profiles enable row level security;

-- 3. Kebijakan RLS (Hanya Superadmin yang bisa melihat semua profil, User biasa hanya profilnya sendiri)
create policy "Users can view their own profile" 
on public.profiles for select using (auth.uid() = id);

create policy "Superadmins can view all profiles" 
on public.profiles for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'superadmin')
);

create policy "Superadmins can update profiles" 
on public.profiles for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'superadmin')
);

-- 4. Fungsi Trigger untuk mendaftarkan akun baru secara otomatis ke tabel profiles
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, role, is_verified)
  values (new.id, new.email, 'user', false);
  return new;
end;
$$;

-- 5. Pasang Trigger ke tabel auth.users bawaan Supabase
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. MIGRASI: Jadikan akun yang sudah ada (akun Anda saat ini) sebagai Superadmin
insert into public.profiles (id, email, role, is_verified)
select id, email, 'superadmin', true from auth.users
on conflict (id) do update set role = 'superadmin', is_verified = true;
