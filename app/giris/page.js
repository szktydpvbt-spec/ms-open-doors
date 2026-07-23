"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!isSupabaseConfigured) {
      setError(
        "Site henüz Supabase ile bağlanmadı. Lütfen yönetici .env.local dosyasını ayarlasın."
      );
      return;
    }

    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (signInError) {
      setError("E-posta veya şifre hatalı.");
      return;
    }

    router.push("/topluluk");
    router.refresh();
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">Giriş Yap</h1>
        <form className="form" onSubmit={handleSubmit} style={{ margin: "0 auto" }}>
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
            placeholder="Şifreniz"
          />

          {error && <p className="form-error">{error}</p>}

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>
        <p className="muted" style={{ marginTop: 16 }}>
          Henüz üye değil misin? <Link href="/kayit">Ücretsiz üye ol</Link>
        </p>
      </div>
    </section>
  );
}
