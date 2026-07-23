import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const serverClient = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const DEFAULTS = {
  hero_title: "MS OPEN DOORS",
  hero_tagline: "You Won't Be Alone.",
  hero_quote: "Not all doors are closed. Some just lead to something stronger.",
  about_text:
    "MS Open Doors, Multipl Skleroz (MS) ile yaşayan bireylerin bilgi alabileceği, deneyimlerini paylaşabileceği ve birbirine destek olabileceği ücretsiz bir topluluk platformudur.",
  about_mission:
    "Amacımız; doğru bilgiye kolay erişim sağlamak, deneyimlerin paylaşılabileceği güvenli bir alan sunmak ve MS ile yaşayan herkesin birbirine destek olabileceği bir topluluk kurmak.",
  resources_intro:
    "Aşağıdaki bilgiler genel farkındalık amaçlıdır ve tıbbi tavsiye yerine geçmez. Tanı, tedavi ve ilaç kararları için mutlaka nörologunuza danışın.",
  contact_email: "iletisim@msopendoors.com",
  contact_note:
    "Sorularınız, önerileriniz veya iş birliği talepleriniz için bize yazabilirsiniz.",
};

// Sunucu bileşenlerinde (Server Components) site_content tablosunu okumak için.
// Supabase henüz yapılandırılmadıysa veya bir kayıt eksikse varsayılan metne düşer.
export async function getSiteContent() {
  if (!serverClient) return DEFAULTS;

  const { data, error } = await serverClient.from("site_content").select("key, value");
  if (error || !data) return DEFAULTS;

  const map = { ...DEFAULTS };
  for (const row of data) {
    map[row.key] = row.value;
  }
  return map;
}

export { DEFAULTS as SITE_CONTENT_DEFAULTS };
