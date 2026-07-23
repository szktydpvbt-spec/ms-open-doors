"use client";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Ortam değişkenleri girilmediyse (ör. yerel önizleme sırasında) uygulamanın
// çökmesini önlemek için sahte bir istemci döndürüyoruz. Gerçek kullanım için
// .env.local dosyasına Supabase bilgilerinizi eklemeniz gerekir.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
