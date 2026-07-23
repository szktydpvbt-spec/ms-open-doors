import { getSiteContent } from "@/lib/siteContent";

export const metadata = { title: "Hakkımızda — MS Open Doors" };

export default async function AboutPage() {
  const content = await getSiteContent();

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">Hakkımızda</h1>
        <div className="grid grid-2">
          <div className="card prose">
            <h3>Biz Kimiz?</h3>
            <p>{content.about_text}</p>
          </div>
          <div className="card prose">
            <h3>Misyonumuz</h3>
            <p>{content.about_mission}</p>
          </div>
        </div>

        <div className="card prose" style={{ marginTop: 20 }}>
          <h3>Nasıl Çalışıyoruz?</h3>
          <p>
            MS Open Doors, gönüllülük esasıyla yürütülen, tamamen ücretsiz bir topluluk
            platformudur. Herhangi bir üyelik ücreti veya reklam geliri modeli yoktur. Üyeler
            Topluluk sayfasında paylaşım yapabilir, birbirlerinin paylaşımlarına yorum
            bırakabilir ve Kaynaklar sayfasından genel bilgilere ulaşabilir.
          </p>
          <p>
            Platform bir sağlık kuruluşu değildir; burada paylaşılan içerikler üyelerin kişisel
            deneyimlerini yansıtır ve tıbbi tavsiye niteliği taşımaz.
          </p>
        </div>
      </div>
    </section>
  );
}
