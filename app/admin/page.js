"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { formatDate } from "@/lib/formatDate";

const CONTENT_FIELDS = [
  { key: "hero_title", label: "Anasayfa Başlık", type: "input" },
  { key: "hero_tagline", label: "Anasayfa Slogan", type: "input" },
  { key: "hero_quote", label: "Anasayfa Alıntı", type: "input" },
  { key: "about_text", label: "Hakkımızda - Biz Kimiz", type: "textarea" },
  { key: "about_mission", label: "Hakkımızda - Misyon", type: "textarea" },
  { key: "resources_intro", label: "Kaynaklar - Uyarı Metni", type: "textarea" },
  { key: "contact_email", label: "İletişim E-posta", type: "input" },
  { key: "contact_note", label: "İletişim Açıklaması", type: "textarea" },
];

const TABS = ["Site İçeriği", "Paylaşımlar", "Üyeler"];

export default function AdminPage() {
  const router = useRouter();
  const { session, profile, loading: authLoading } = useAuth();
  const [tab, setTab] = useState(TABS[0]);

  const [contentValues, setContentValues] = useState({});
  const [contentStatus, setContentStatus] = useState("");
  const [savingKey, setSavingKey] = useState("");

  const [posts, setPosts] = useState([]);
  const [members, setMembers] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!authLoading && (!session || !profile?.is_admin)) {
      router.push("/");
    }
  }, [authLoading, session, profile, router]);

  const loadAll = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    setLoadingData(true);

    const [{ data: contentRows }, { data: postRows }, { data: memberRows }] = await Promise.all([
      supabase.from("site_content").select("key, value"),
      supabase
        .from("posts")
        .select("id, content, created_at, profiles(full_name)")
        .order("created_at", { ascending: false }),
      supabase
        .from("profiles")
        .select("id, full_name, is_admin, created_at")
        .order("created_at", { ascending: false }),
    ]);

    if (contentRows) {
      const map = {};
      contentRows.forEach((r) => (map[r.key] = r.value));
      setContentValues(map);
    }
    setPosts(postRows || []);
    setMembers(memberRows || []);
    setLoadingData(false);
  }, []);

  useEffect(() => {
    if (session && profile?.is_admin) loadAll();
  }, [session, profile, loadAll]);

  async function handleSaveContent(key) {
    setSavingKey(key);
    setContentStatus("");
    const { error } = await supabase
      .from("site_content")
      .upsert({ key, value: contentValues[key] || "" });
    setSavingKey("");
    setContentStatus(error ? "Kaydedilemedi: " + error.message : `"${key}" kaydedildi.`);
  }

  async function handleDeletePost(postId) {
    if (!confirm("Bu paylaşımı ve yorumlarını silmek istediğine emin misin?")) return;
    await supabase.from("posts").delete().eq("id", postId);
    loadAll();
  }

  async function handleToggleAdmin(memberId, current) {
    const label = current ? "yönetici yetkisini kaldırmak" : "yönetici yapmak";
    if (!confirm(`Bu üyeyi ${label} istediğine emin misin?`)) return;
    await supabase.from("profiles").update({ is_admin: !current }).eq("id", memberId);
    loadAll();
  }

  if (authLoading || !session || !profile?.is_admin) return null;

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">Yönetim Paneli</h1>

        <div className="admin-tabs">
          {TABS.map((t) => (
            <button
              key={t}
              className={`admin-tab ${tab === t ? "active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Site İçeriği" && (
          <div className="card">
            <p className="muted" style={{ marginBottom: 16 }}>
              Buradan değiştirdiğin metinler anında sitede yayına girer.
            </p>
            {contentStatus && <p className="form-success">{contentStatus}</p>}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {CONTENT_FIELDS.map((field) => (
                <div key={field.key}>
                  <label style={{ display: "block", marginBottom: 6, color: "var(--text-muted)", fontSize: 13 }}>
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      rows={3}
                      style={{ width: "100%" }}
                      value={contentValues[field.key] || ""}
                      onChange={(e) =>
                        setContentValues((v) => ({ ...v, [field.key]: e.target.value }))
                      }
                    />
                  ) : (
                    <input
                      style={{ width: "100%" }}
                      value={contentValues[field.key] || ""}
                      onChange={(e) =>
                        setContentValues((v) => ({ ...v, [field.key]: e.target.value }))
                      }
                    />
                  )}
                  <button
                    className="btn btn-sm"
                    style={{ marginTop: 8 }}
                    onClick={() => handleSaveContent(field.key)}
                    disabled={savingKey === field.key}
                  >
                    {savingKey === field.key ? "Kaydediliyor..." : "Kaydet"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "Paylaşımlar" && (
          <div className="card">
            {loadingData && <p className="muted">Yükleniyor...</p>}
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Yazan</th>
                  <th>İçerik</th>
                  <th>Tarih</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id}>
                    <td>{p.profiles?.full_name || "Üye"}</td>
                    <td style={{ maxWidth: 320 }}>{p.content}</td>
                    <td>{formatDate(p.created_at)}</td>
                    <td>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDeletePost(p.id)}>
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loadingData && posts.length === 0 && <p className="muted">Henüz paylaşım yok.</p>}
          </div>
        )}

        {tab === "Üyeler" && (
          <div className="card">
            {loadingData && <p className="muted">Yükleniyor...</p>}
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ad Soyad</th>
                  <th>Katılım</th>
                  <th>Rol</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id}>
                    <td>{m.full_name}</td>
                    <td>{formatDate(m.created_at)}</td>
                    <td>
                      <span className="badge">{m.is_admin ? "Yönetici" : "Üye"}</span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm"
                        onClick={() => handleToggleAdmin(m.id, m.is_admin)}
                      >
                        {m.is_admin ? "Yöneticiliği Kaldır" : "Yönetici Yap"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
