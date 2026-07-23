"use client";

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

  async function handleSignOut() {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="brand">
          MS OPEN DOORS
        </Link>
        <nav className="nav-links">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? "active" : ""}
            >
              {link.label}
            </Link>
          ))}
          {profile?.is_admin && (
            <Link href="/admin" className={pathname === "/admin" ? "active" : ""}>
              Yönetim
            </Link>
          )}
        </nav>
        <div className="nav-links">
          {session ? (
            <>
              <Link href="/profil" className="muted">
                {profile?.full_name || "Üye"}
              </Link>
              <button className="btn btn-sm" onClick={handleSignOut}>
                Çıkış
              </button>
            </>
          ) : (
            <>
              <Link href="/giris">Giriş</Link>
              <Link href="/kayit" className="btn btn-sm btn-primary">
                Üye Ol
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
