export default function Highlights() {
  const items = [
    { value: "10+", label: "Progetti consegnati" },
    { value: "3", label: "Settori serviti (PMI, no‑profit, artigiani)" },
    { value: "2 sett.", label: "Kick‑off medio" },
  ];
  return (
    <section className="highlights">
      <div className="container">
        {items.map((it) => (
          <div className="hl" key={it.label}>
            <div className="hl-value">{it.value}</div>
            <div className="hl-label">{it.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
