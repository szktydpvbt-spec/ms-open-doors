import Link from "next/link";
import HeroStatsOverlay from "@/components/HeroStatsOverlay";
import { getSiteContent } from "@/lib/siteContent";

export default async function HomePage() {
  // content is still fetched for other admin-editable text on the site;
  // the hero visual itself is the reference photo below (title, tagline,
  // quote and stat labels are baked into the image).
  await getSiteContent();

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-image-wrap hero-image-full">
            <img
              src="/hero-open-doors.jpg"
              alt="MS Open Doors — You Won't Be Alone"
              className="hero-image"
            />
            <HeroStatsOverlay />
          </div>
          <div className="hero-cta">
            <Link href="/kayit" className="btn btn-primary">
              Ücretsiz Üye Ol
            </Link>
            <Link href="/topluluk" className="btn">
              Topluluğu Keşfet
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Burada Neler Bulacaksın?</h2>
          <div className="grid grid-3">
            <div className="card">
              <h3>Bilgi Al</h3>
              <p className="muted">
                MS hakkında güvenilir, sade ve anlaşılır bilgilere Kaynaklar sayfamızdan
                ulaşabilirsin.
              </p>
            </div>
            <div className="card">
              <h3>Paylaş</h3>
              <p className="muted">
                Deneyimlerini, sorularını ve tavsiyelerini Topluluk sayfasında diğer üyelerle
                paylaş, yorum yap.
              </p>
            </div>
            <div className="card">
              <h3>Destek Bul</h3>
              <p className="muted">
                Aynı yoldan geçen insanlarla bağlantı kur. Bu yolda yalnız yürümüyorsun.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="notice">
            Bu platform tamamen ücretsizdir ve tıbbi tavsiye sunmaz. Sağlık kararlarınız için
            lütfen doktorunuza danışın.
          </div>
        </div>
      </section>
    </>
  );
}
