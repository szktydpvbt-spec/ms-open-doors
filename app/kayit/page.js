"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isSupabaseConfigured) {
      setError(
        "Site henüz Supabase ile bağlanmadı. Lütfen yönetici .env.local dosyasını ayarlasın."
      );
      return;
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalı.");
      return;
    }

    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setSuccess(
      "Kaydın alındı! E-postana gelen doğrulama bağlantısına tıkladıktan sonra giriş yapabilirsin."
    );
    setTimeout(() => router.push("/giris"), 2500);
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">Ücretsiz Üye Ol</h1>
        <form className="form" onSubmit={handleSubmit} style={{ margin: "0 auto" }}>
          <label htmlFor="fullName">Ad Soyad</label>
          <input
            id="fullName"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Adınız Soyadınız"
          />

          <label htmlFor="email">E-posta</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@eposta.com"
          />

          <label htmlFor="password">Şifre</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="En az 6 karakter"
          />

          {error && <p className="form-error">{error}</p>}
          {success && <p className="form-success">{success}</p>}

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Kaydediliyor..." : "Üye Ol"}
          </button>
        </form>
        <p className="muted" style={{ marginTop: 16 }}>
          Zaten üye misin? <Link href="/giris">Giriş yap</Link>
        </p>
      </div>
    </section>
  );
}
