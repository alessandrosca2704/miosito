import { Link } from "react-router-dom";
import Process from "../component/Process";
import "../Css/Servizi.css"
function Servizi(){
    return(
         <section className="services">
           {/*Hero servizi*/}
            {/*<h2>Cosa posso fare per te:</h2>
            <div className="cards">
                <div className="card">
                    <h3>🌐 Siti Web</h3>
                    <p>Moderni , responsive e veloci.</p>
                </div>
                <div className="card">
                <h3>📱 Web App</h3>
                <p>Strumenti interattivi per la tua azienda.</p>
                </div>
                <div className="card">
                <h3>📡 Iot</h3>
                <p>Connessione tra sensori e dashboard online</p>
                </div>
            </div>*/}
            <header className="services-hero">
                <div className="services-hero__inner reveal delay-2">
                    <h1>Soluzioni su misura per PMI</h1>
                    <p className="services-hero__sub">
                        Dallo <strong>sviluppo web</strong> alle <strong>soluzioni IoT</strong>: progetto , realizzo e rendo disponibili online strumenti semplici , veloci e scalabili.
                    </p>
                    <ul className="services-bullets" role="list">
                        <li>
                            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>
                            Tempi e costi chiari fin dall'inzio
                        </li>
                        <li>
                            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 2 2 7l10 5 10-5-10-5Zm0 9L2 6v11l10 5 10-5V6l-10 5Z"/></svg>
                            Prototipo rapido (PoC) prima dello sviluppo
                        </li>
                        <li>
                            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M3 12a9 9 0 1 0 18 0A9 9 0 0 0 3 12Zm10-5v6l5 3"/></svg>
                            Supporto post-lancio e monitoraggio
                        </li>
                    </ul>
                    <div className="services-cta">
                        <Link to="/contatti" className="btn secondary" >Richiedi preventivo</Link>
                        <Link to="/portfolio" className="btn secondary">Vedi progetti</Link>
                    </div>

                    <div className="services-badges">
                        <span className="pill primary">IoT • Web App • Siti Web</span>
                        <span className="pill ok">Disponibile per nuovi progetti</span>
                    </div>
                </div>
            </header>
             <Process/>
            {/*Portfolio*/}
            <section className="portfolio-preview">
                <h2>Progetti recenti:</h2>
                <div className="projects">
                    <div className="project">
                        <h4>Progettazione di un sistema IoT basato su sensori di movimento per il controllo di sistemi industriali </h4>
                        <button className="PulsantiS"><a href="/files/Tesi.pdf" target="_blank" rel="noopener noreferrer" className="btn" style={{textDecoration:'none', color:'white'}}>Scopri di più</a></button>
                    </div>
                    <div className="project">
                        <h4>Realizzazione sito web per gruppo scout</h4>
                        <button className="PulsantiS"><a href="https://alessandrosca2704.wixsite.com/bari-14" target="_blank" rel="noopener noreferrer" className="btn" style={{textDecoration:'none', color:'white'}}>Scopri di più</a></button>
                    </div>
                </div>
            </section>
        </section>
    );
}
export default Servizi;