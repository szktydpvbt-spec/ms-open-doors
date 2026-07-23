-- =========================================================
-- MS Open Doors - Supabase şeması
-- Bu dosyayı Supabase panelinde SQL Editor'e yapıştırıp
-- "Run" ile bir kere çalıştırmanız yeterlidir.
-- =========================================================

-- ---------------------------------------------------------
-- 1) PROFİLLER (üyelik sistemi)
-- ---------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default 'Üye',
  bio text,
  avatar_url text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiller herkese açık okunabilir"
  on public.profiles for select
  using (true);

create policy "Kullanıcı kendi profilini günceller"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admin tüm profilleri güncelleyebilir"
  on public.profiles for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

-- Yeni kullanıcı kayıt olduğunda otomatik profil oluştur
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', 'Üye'));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------
-- 2) PAYLAŞIMLAR (topluluk gönderileri)
-- ---------------------------------------------------------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.posts enable row level security;

create policy "Paylaşımlar herkese açık okunabilir"
  on public.posts for select
  using (true);

create policy "Giriş yapan üye paylaşım oluşturabilir"
  on public.posts for insert
  with check (auth.uid() = user_id);

create policy "Sahibi veya admin paylaşımı silebilir"
  on public.posts for delete
  using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

-- ---------------------------------------------------------
-- 3) YORUMLAR
-- ---------------------------------------------------------
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.comments enable row level security;

create policy "Yorumlar herkese açık okunabilir"
  on public.comments for select
  using (true);

create policy "Giriş yapan üye yorum oluşturabilir"
  on public.comments for insert
  with check (auth.uid() = user_id);

create policy "Sahibi veya admin yorumu silebilir"
  on public.comments for delete
  using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

-- ---------------------------------------------------------
-- 4) SİTE İÇERİĞİ (admin panelinden düzenlenebilir metinler)
-- ---------------------------------------------------------
create table if not exists public.site_content (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

create policy "Site içeriği herkese açık okunabilir"
  on public.site_content for select
  using (true);

create policy "Sadece admin site içeriğini değiştirebilir"
  on public.site_content for insert
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

create policy "Sadece admin site içeriğini günceller"
  on public.site_content for update
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

-- Varsayılan içerikler
insert into public.site_content (key, value) values
  ('hero_title', 'MS OPEN DOORS'),
  ('hero_tagline', 'You Won''t Be Alone.'),
  ('hero_quote', 'Not all doors are closed. Some just lead to something stronger.'),
  ('about_text', 'MS Open Doors, Multipl Skleroz (MS) ile yaşayan bireylerin bilgi alabileceği, deneyimlerini paylaşabileceği ve birbirine destek olabileceği ücretsiz bir topluluk platformudur. Kimse bu yolda yalnız yürümemeli.'),
  ('about_mission', 'Amacımız; doğru bilgiye kolay erişim sağlamak, deneyimlerin paylaşılabileceği güvenli bir alan sunmak ve MS ile yaşayan herkesin birbirine destek olabileceği bir topluluk kurmak.'),
  ('resources_intro', 'Aşağıdaki bilgiler genel farkındalık amaçlıdır ve tıbbi tavsiye yerine geçmez. Tanı, tedavi ve ilaç kararları için mutlaka nörologunuza danışın.'),
  ('contact_email', 'iletisim@msopendoors.com'),
  ('contact_note', 'Sorularınız, önerileriniz veya iş birliği talepleriniz için bize yazabilirsiniz. Tıbbi acil durumlar için lütfen en yakın sağlık kuruluşuna başvurun.')
on conflict (key) do nothing;

-- ---------------------------------------------------------
-- 5) İLK YÖNETİCİYİ ATAMA (siteyi kurduktan sonra)
-- ---------------------------------------------------------
-- Önce normal bir kullanıcı olarak siteye kayıt olun.
-- Sonra aşağıdaki satırı KENDİ e-postanızla değiştirip
-- SQL Editor'de çalıştırın:
--
-- update public.profiles set is_admin = true
-- where id = (select id from auth.users where email = 'sizin-emailiniz@example.com');

-- ---------------------------------------------------------
-- 6) BEĞENİLER (paylaşım beğenme)
-- ---------------------------------------------------------
create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);

alter table public.likes enable row level security;

create policy "Beğeniler herkese açık okunabilir"
  on public.likes for select
  using (true);

create policy "Giriş yapan üye beğenebilir"
  on public.likes for insert
  with check (auth.uid() = user_id);

create policy "Üye kendi beğenisini kaldırabilir"
  on public.likes for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------
-- 7) KAYNAKLAR SAYFASI GÖRSELLERİ (admin panelinden yüklenir)
-- ---------------------------------------------------------
create table if not exists public.resource_images (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  caption text,
  created_at timestamptz not null default now()
);

alter table public.resource_images enable row level security;

create policy "Kaynak görselleri herkese açık okunabilir"
  on public.resource_images for select
  using (true);

create policy "Sadece admin görsel ekleyebilir"
  on public.resource_images for insert
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

create policy "Sadece admin görsel silebilir"
  on public.resource_images for delete
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

-- Depolama (storage) bucket'ı: kaynak görselleri herkese açık okunur,
-- sadece adminler yükleyip silebilir.
insert into storage.buckets (id, name, public)
values ('resource-images', 'resource-images', true)
on conflict (id) do nothing;

create policy "Kaynak görselleri storage'dan herkese açık okunabilir"
  on storage.objects for select
  using (bucket_id = 'resource-images');

create policy "Sadece admin storage'a görsel yükleyebilir"
  on storage.objects for insert
  with check (
    bucket_id = 'resource-images'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

create policy "Sadece admin storage'dan görsel silebilir"
  on storage.objects for delete
  using (
    bucket_id = 'resource-images'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
  );

-- ---------------------------------------------------------
-- 8) PAYLAŞIM GÖRSELLERİ (topluluk paylaşımlarına resim ekleme)
-- ---------------------------------------------------------
alter table public.posts add column if not exists image_url text;

-- Depolama (storage) bucket'ı: paylaşım görselleri herkese açık okunur,
-- giriş yapan her üye kendi paylaşımına görsel yükleyebilir, sadece
-- yükleyen kişi (veya admin) silebilir.
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

create policy "Paylasim gorselleri storage'dan herkese acik okunabilir"
  on storage.objects for select
  using (bucket_id = 'post-images');

create policy "Giris yapan uye paylasim gorseli yukleyebilir"
  on storage.objects for insert
  with check (bucket_id = 'post-images' and auth.role() = 'authenticated');

create policy "Yukleyen uye veya admin paylasim gorselini silebilir"
  on storage.objects for delete
  using (
    bucket_id = 'post-images'
    and (
      owner = auth.uid()
      or exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin)
    )
  );
