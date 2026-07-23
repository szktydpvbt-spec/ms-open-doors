"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

export default function ProfilePage() {
  const router = useRouter();
  const { session, profile, loading, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!loading && !session) router.push("/giris");
  }, [loading, session, router]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setBio(profile.bio || "");
    }
  }, [profile]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, bio })
      .eq("id", session.user.id);
    setSaving(false);
    if (error) {
      setMessage("Kaydedilemedi: " + error.message);
    } else {
      setMessage("Profil güncellendi.");
      refreshProfile();
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <section className="section">
        <div className="container">
          <p className="notice">Supabase henüz yapılandırılmadı.</p>
        </div>
      </section>
    );
  }

  if (loading || !session) return null;

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">Profilim</h1>
        <form className="form" onSubmit={handleSave} style={{ margin: "0 auto" }}>
          <label htmlFor="fullName">Ad Soyad</label>
          <input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <label htmlFor="bio">Hakkında (isteğe bağlı)</label>
          <textarea
            id="bio"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Kısaca kendinden bahsedebilirsin"
          />

          {message && <p className="form-success">{message}</p>}

          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </form>
      </div>
    </section>
  );
}
