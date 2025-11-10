import TemplateLayout from "./TemplateLayout";

const heroMedia = {
  src: "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1176",
  alt: "Interno di una boutique contemporanea"
};

const products = [
  {
    name: "Box degustazione",
    price: "€24",
    note: "5 assaggi selezionati + pairing vini",
    image: "https://images.unsplash.com/photo-1598306442837-613a3def54ff?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=735"
  },
  {
    name: "Menu pranzo veloce",
    price: "€14",
    note: "Piatti stagionali ready to go",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80&sat=-50"
  },
  {
    name: "Gift card boutique",
    price: "da €50",
    note: "Formato digitale o cartaceo",
    image: "https://plus.unsplash.com/premium_photo-1670509045675-af9f249b1bbe?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1135"
  },
  {
    name: "Kit home bar",
    price: "€39",
    note: "Selezione artigianale + ricettario",
    image: "https://images.unsplash.com/photo-1758640927926-9f0b1cda712e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"
  }
];

const hours = [
  { day: "LUN - VEN", time: "09:00 - 20:00" },
  { day: "SABATO", time: "10:00 - 22:00" },
  { day: "DOMENICA", time: "10:00 - 18:00" }
];

const galleryShots = [
  {
    src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80",
    alt: "Esposizione prodotti artigianali"
  },
  {
    src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
    alt: "Tavolo apparecchiato per brunch"
  },
  {
    src: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    alt: "Dettagli packaging personalizzati"
  }
];

export default function RetailTemplate() {
  return (
    <TemplateLayout
      id="retail"
      theme="retail"
      quickNav={{
        label: "Menu rapido",
        items: [
          { label: "Prodotti", target: "prodotti" },
          { label: "Promo", target: "promo" },
          { label: "Orari", target: "orari" },
          { label: "Mappa", target: "mappa" }
        ]
      }}
      hero={{
        eyebrow: "Template • Retail & Local shop",
        title: "Una one-page per negozi, boutique e locali food",
        subtitle:
          "Menù istantaneo, galleria prodotti, orari e mappa integrata per conversioni rapide e prenotazioni veloci.",
        description:
          "Il layout apre con menu sticky, mostra card prodotto fotografiche e si chiude con CTA prenotazione + integrazione mappe.",
        media: heroMedia,
        ctas: [
          { label: "Prenota subito", href: "#contatto" },
          { label: "Sfoglia il catalogo", href: "#prodotti", variant: "ghost" }
        ],
        badges: ["Menu rapido", "Mappa interattiva"]
      }}
      stats={[
        { label: "Clienti ricorrenti", value: "72%" },
        { label: "Tempo medio ordine", value: "2 min" },
        { label: "Nuove prenotazioni/mese", value: "120+" }
      ]}
      sections={[
        {
          id: "prodotti",
          eyebrow: "Cards prodotti",
          title: "Catalogo modulare a scorrimento",
          description: "Card con foto, prezzo e micro-copy per vendita rapida.",
          content: (
            <div className="product-grid">
              {products.map((product) => (
                <article key={product.name} className="product-card">
                  <img src={product.image} alt={product.name} loading="lazy" />
                  <h3>{product.name}</h3>
                  <strong>{product.price}</strong>
                  <p>{product.note}</p>
                  <button type="button" className="btn btn-primary">
                    Aggiungi
                  </button>
                </article>
              ))}
            </div>
          )
        },
        {
          id: "gallery",
          eyebrow: "Moodboard visuale",
          title: "Fotografie per comunicare atmosfera",
          description: "Tre scatti per raccontare packaging, sala e banco prodotti.",
          content: (
            <div className="media-grid media-grid--photo">
              {galleryShots.map((shot) => (
                <img key={shot.src} src={shot.src} alt={shot.alt} loading="lazy" />
              ))}
            </div>
          )
        },
        {
          id: "promo",
          eyebrow: "Banner promo",
          title: "Promozioni stagionali e CTA",
          description: "Blocco hero secondario con countdown o codice promo.",
          content: (
            <div className="promo-banner">
              <span className="badge">Solo weekend</span>
              <h3>Brunch + Drink omaggio</h3>
              <p>
                Prenota entro venerdì con codice <strong>BRUNCH10</strong>.
              </p>
              <a href="#contatto">Riserva il tavolo →</a>
            </div>
          )
        },
        {
          id: "orari",
          eyebrow: "Orari & contatti",
          title: "Tutte le info essenziali in un blocco",
          description: "Griglia orari, recapiti e badge recensioni.",
          content: (
            <div className="card-grid">
              <article className="location-card">
                <h3>Orari</h3>
                <ul>
                  {hours.map((slot) => (
                    <li key={slot.day}>
                      <strong>{slot.day}</strong> – {slot.time}
                    </li>
                  ))}
                </ul>
              </article>
              <article className="location-card">
                <h3>Contatti</h3>
                <p>📞 02 1234 5678</p>
                <p>💬 WhatsApp sempre attivo</p>
                <p>⭐ 4.8 su 320 recensioni</p>
              </article>
            </div>
          )
        },
        {
          id: "mappa",
          eyebrow: "Mappa interattiva",
          title: "CTA direzione e ritiro",
          description: "Embed mappe + CTA 'Ottieni indicazioni'.",
          content: (
            <div className="map-embed">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d192387.43621120183!2d16.71726658534957!3d41.11151846636153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1347e8f8f3078d6f%3A0x87254066a3908e1!2sBari%2C%20Metropolitan%20City%20of%20Bari!5e0!3m2!1sen!2sit!4v1762767959444!5m2!1sen!2sit" width="600" height="450" style={{border:"0"}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>            
            </div>
          )
        }
      ]}
      highlights={["Cards prodotti", "Banner promo", "Mappa interattiva"]}
      stickyCta={{
        id: "contatto",
        eyebrow: "Prenotazione veloce",
        title: "Blocca il tuo slot",
        description: "Richiedi un tavolo, un ritiro o una consulenza boutique.",
        points: ["Risposta in 15 minuti", "Pagamento link a distanza", "Reminder automatico"],
        fields: [
          { name: "nome", label: "Nome", placeholder: "Chiara" },
          { name: "contatto", label: "Telefono", placeholder: "+39 333 1234567" },
          { name: "servizio", label: "Servizio", placeholder: "Tavolo, ritiro, consulenza..." },
          { name: "messaggio", label: "Messaggio", type: "textarea", placeholder: "Indica data, orario o richieste" }
        ],
        ctaLabel: "Conferma prenotazione",
        helper: "Ricontattiamo via SMS o WhatsApp."
      }}
    />
  );
}
