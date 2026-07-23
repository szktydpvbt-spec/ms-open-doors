import { getSiteContent } from "@/lib/siteContent";

export const metadata = { title: "İletişim — MS Open Doors" };

export default async function ContactPage() {
  const content = await getSiteContent();

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">İletişim</h1>
        <div className="card prose" style={{ maxWidth: 560, margin: "0 auto" }}>
          <p>{content.contact_note}</p>
          <p>
            E-posta:{" "}
            <a href={`mailto:${content.contact_email}`}>{content.contact_email}</a>
          </p>
          <p className="muted" style={{ fontSize: 13 }}>
            Tıbbi acil durumlarda lütfen en yakın sağlık kuruluşuna başvurun. Bu platform bir
            sağlık hizmeti sağlayıcısı değildir.
          </p>
        </div>
      </div>
    </section>
  );
}
