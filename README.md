# MS Open Doors

MS (Multipl Skleroz) hastalarının bilgi alabildiği ve sosyalleşebildiği, tamamen ücretsiz bir topluluk sitesi. Next.js + Supabase ile yapıldı; hem barındırma (Vercel) hem veritabanı/üyelik (Supabase) ücretsiz katmanlarla çalışır.

## Özellikler

- Üyelik sistemi (e-posta ile kayıt/giriş)
- Topluluk akışı: paylaşım yapma, paylaşımların altına yorum yazma
- Kaynaklar sayfası: MS hakkında genel bilgiler
- Yönetim paneli: site metinlerini düzenleme, paylaşım silme, üyelere yöneticilik verme
- Siyah–altın, "MS Open Doors / You Won't Be Alone" temalı tasarım

## Kurulum (adım adım)

### 1. Supabase projesi oluştur (ücretsiz)

1. [supabase.com](https://supabase.com) adresinden ücretsiz hesap aç.
2. "New Project" ile yeni bir proje oluştur (bölge olarak Avrupa'ya yakın bir bölge seçebilirsin).
3. Proje açıldıktan sonra sol menüden **SQL Editor**'e gir.
4. Bu projedeki `supabase/schema.sql` dosyasının tüm içeriğini kopyala, SQL Editor'e yapıştır ve **Run** butonuna bas. Bu işlem üyelik, paylaşım, yorum ve site içeriği tablolarını otomatik oluşturur.

### 2. Bağlantı bilgilerini al

1. Supabase panelinde **Project Settings > API** sayfasına git.
2. `Project URL` ve `anon public` anahtarını kopyala.
3. Bu projede `.env.local.example` dosyasını `.env.local` olarak kopyala ve içine bu iki değeri yapıştır:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 3. Yerelde test etme (isteğe bağlı)

```
npm install
npm run dev
```

Tarayıcıdan `http://localhost:3000` adresini aç.

### 4. Ücretsiz yayına alma (Vercel)

1. Bu klasörü bir GitHub reposuna yükle.
2. [vercel.com](https://vercel.com) üzerinden ücretsiz hesap aç, GitHub reponu bağla, "Import Project" ile bu projeyi seç.
3. Deploy ayarlarında **Environment Variables** kısmına `.env.local` içindeki iki değeri aynen ekle.
4. **Deploy** butonuna bas. Birkaç dakika içinde site `xxx.vercel.app` adresinde yayında olur (istersen kendi alan adını da ücretsiz olarak buna bağlayabilirsin, sadece domain'in kendisi genelde ücretlidir).

### 5. İlk yöneticiyi (admin) atama

1. Siteye normal bir üye gibi kayıt ol (Üye Ol sayfası).
2. Supabase panelinde SQL Editor'e gidip `schema.sql` dosyasının en altındaki şu satırı, kendi e-postanla değiştirip çalıştır:

```sql
update public.profiles set is_admin = true
where id = (select id from auth.users where email = 'sizin-emailiniz@example.com');
```

3. Siteye tekrar giriş yaptığında üst menüde **Yönetim** linkini göreceksin. Buradan site metinlerini, paylaşımları ve üyelerin yöneticilik yetkisini yönetebilirsin.

## Maliyet

- **Supabase Free**: 500MB veritabanı, 50.000 aylık aktif kullanıcı — küçük/orta bir topluluk için fazlasıyla yeterli.
- **Vercel Hobby**: Kişisel/kâr amacı gütmeyen projeler için ücretsiz.

Trafik çok büyürse ileride ücretli katmanlara geçmek gerekebilir, ama başlangıç ve uzun süre için tamamen ücretsiz kalır.

## Proje yapısı

```
app/            → Sayfalar (anasayfa, hakkımızda, topluluk, kaynaklar, iletişim, giriş, kayıt, admin)
components/     → Paylaşılan arayüz bileşenleri (Navbar, PostCard, CommentSection, vb.)
lib/            → Supabase bağlantısı ve yardımcı fonksiyonlar
supabase/       → Veritabanı şeması (schema.sql)
```

## Notlar

- Bu platform bir sağlık hizmeti sağlayıcısı değildir; Kaynaklar sayfasındaki bilgiler genel farkındalık amaçlıdır, tıbbi tavsiye yerine geçmez.
- Üyeler yalnızca kendi paylaşım/yorumlarını silebilir; yöneticiler herhangi bir paylaşım/yorumu kaldırabilir.
