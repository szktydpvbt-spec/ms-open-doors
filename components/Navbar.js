"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

const links = [
  { href: "/", label: "Anasayfa" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/topluluk", label: "Topluluk" },
  { href: "/kaynaklar", label: "Kaynaklar" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { session, profile } = useAuth();
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  async function handleSignOut() {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
    closeMenu();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="brand" onClick={closeMenu}>
          MS OPEN DOORS
        </Link>

        <button
          className="nav-toggle"
          type="button"
          aria-label="Menüyü aç/kapat"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`nav-collapse ${open ? "open" : ""}`}>
          <nav className="nav-links">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={pathname === link.href ? "active" : ""}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="nav-account">
            {profile?.is_admin && (
              <Link
                href="/admin"
                className={pathname === "/admin" ? "active" : ""}
                onClick={closeMenu}
              >
                Yönetim
              </Link>
            )}
            {session ? (
              <>
                <Link href="/profil" className="muted" onClick={closeMenu}>
                  {profile?.full_name || "Üye"}
                </Link>
                <button className="btn btn-sm" onClick={handleSignOut}>
                  Çıkış
                </button>
              </>
            ) : (
              <>
                <Link href="/giris" onClick={closeMenu}>
                  Giriş
                </Link>
                <Link href="/kayit" className="btn btn-sm btn-primary" onClick={closeMenu}>
                  Üye Ol
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
