import { getSiteContent, getResourceImages } from "@/lib/siteContent";

export const metadata = { title: "Kaynaklar — MS Open Doors" };

const sections = [
  {
    title: "MS (Multipl Skleroz) Nedir?",
    body: "Multipl Skleroz, bağışıklık sisteminin merkezi sinir sistemindeki (beyin, omurilik ve göz sinirleri) miyelin kılıfına saldırdığı kronik bir otoimmün hastalıktır. Miyelin hasarı, sinir sinyallerinin iletiminde yavaşlamaya veya kesintiye yol açar. MS bulaşıcı değildir ve seyri kişiden kişiye büyük farklılık gösterir.",
  },
  {
    title: "Başlıca Belirtiler",
    body: "Aşırı yorgunluk, görme bozuklukları (bulanık görme, çift görme, optik nörit), kol veya bacaklarda uyuşma/karıncalanma, kas güçsüzlüğü ve spastisite, denge ve koordinasyon sorunları, bilişsel değişiklikler (dikkat, hafıza), mesane ve bağırsak fonksiyon değişiklikleri görülebilir. Belirtiler kişiden kişiye, hatta ataktan atağa değişebilir.",
  },
  {
    title: "MS Türleri",
    body: "En sık görülen tip, atak ve iyileşme dönemleriyle seyreden Ataklarla Seyreden MS (RRMS)'dir. Zamanla bazı hastalarda Sekonder Progresif MS (SPMS)'e dönüşebilir. Baştan itibaren kademeli kötüleşme gösteren Primer Progresif MS (PPMS) daha nadirdir. Tip ve seyir, tedavi planını doğrudan etkiler.",
  },
  {
    title: "Tanı ve Tedavi Yaklaşımları",
    body: "Tanı; nörolojik muayene, MRI görüntüleme, uyarılmış potansiyel testleri ve gerektiğinde beyin omurilik sıvısı analizi ile konulur. Hastalık seyrini yavaşlatmaya yönelik hastalık modifiye edici tedaviler (DMT) ve atak dönemlerinde kortikosteroid tedavileri kullanılabilir. Fizyoterapi, ergoterapi ve düzenli egzersiz yaşam kalitesini destekler.",
  },
  {
    title: "Günlük Yaşamla Başa Çıkma",
    body: "Düzenli, orta yoğunlukta egzersiz; yeterli uyku; stres yönetimi; sıcak ortamlardan kaçınma (bazı kişilerde ısı belirtileri artırabilir) ve dengeli beslenme fayda sağlayabilir. Yorgunluk yönetimi için günü küçük parçalara bölmek ve dinlenme aralarını planlamak yardımcı olabilir. Aile ve arkadaş desteği, aynı deneyimi paylaşan bir toplulukla bağlantı kurmak da psikolojik olarak destekleyicidir.",
  },
];

const links = [
  { name: "MS Derneği (Türkiye)", url: "https://www.msdernegi.org.tr" },
  { name: "National MS Society", url: "https://www.nationalmssociety.org" },
  { name: "MS International Federation (MSIF)", url: "https://www.msif.org" },
];

export default async function ResourcesPage() {
  const content = await getSiteContent();
  const images = await getResourceImages();

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">Kaynaklar</h1>
        <div className="notice" style={{ marginBottom: 28 }}>
          {content.resources_intro}
        </div>

        <div className="stack">
          {sections.map((s) => (
            <div className="card prose" key={s.title}>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}

          {images.length > 0 && (
            <div className="card">
              <h3>Görseller</h3>
              <div className="grid grid-3" style={{ marginTop: 12 }}>
                {images.map((img) => (
                  <figure key={img.id} style={{ margin: 0 }}>
                    <img
                      src={img.url}
                      alt={img.caption || "Kaynaklar görseli"}
                      style={{ width: "100%", borderRadius: 8, display: "block" }}
                    />
                    {img.caption && (
                      <figcaption className="muted" style={{ fontSize: 12, marginTop: 6 }}>
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </div>
          )}

          <div className="card">
            <h3>Faydalı Kuruluşlar</h3>
            <ul>
              {links.map((l) => (
                <li key={l.url}>
                  <a href={l.url} target="_blank" rel="noreferrer">
                    {l.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
