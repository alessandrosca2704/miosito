export const APPROACH_TRANSITION_DELAY_MS = 280;

export const approachSteps = [
  {
    eyebrow: "01 / Discovery",
    title: "Analisi del problema",
    text: "Parto da obiettivi, vincoli e processi reali: prima di scrivere codice definisco cosa deve cambiare e come misurarlo.",
    signal: "input -> scope -> priorita",
  },
  {
    eyebrow: "02 / Architecture",
    title: "Architettura della soluzione",
    text: "Disegno flussi, dati e integrazioni con attenzione a mantenibilita, scalabilita e costi operativi.",
    signal: "frontend | api | dati | automazioni",
  },
  {
    eyebrow: "03 / Build",
    title: "Sviluppo pulito e scalabile",
    text: "Implemento in modo iterativo, con componenti leggibili, feedback frequenti e una base pronta a crescere.",
    signal: "commit -> review -> release",
  },
  {
    eyebrow: "04 / Delivery",
    title: "Ottimizzazione, deploy e manutenzione",
    text: "Porto il progetto online, controllo performance e stabilita, poi mantengo il sistema allineato agli obiettivi.",
    signal: "deploy -> monitor -> improve",
  },
];
