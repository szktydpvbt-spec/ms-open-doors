import Link from "next/link";
import TreeDoorArt from "@/components/TreeDoorArt";
import StatsBar from "@/components/StatsBar";
import { getSiteContent } from "@/lib/siteContent";

export default async function HomePage() {
  const content = await getSiteContent();

  return (
    <>
      <section className="hero">
        <div className="container">
          <TreeDoorArt />
          <h1 className="hero-title">{content.hero_title}</h1>
          <p className="hero-tagline">{content.hero_tagline}</p>
          <p className="hero-quote">{content.hero_quote}</p>
          <div className="hero-cta">
            <Link href="/kayit" className="btn btn-primary">
              Ücretsiz Üye Ol
            </Link>
            <Link href="/topluluk" className="btn">
              Topluluğu Keşfet
            </Link>
          </div>
          <StatsBar />
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
