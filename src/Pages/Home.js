import { Link } from "react-router-dom";
import '../Css/Home.css'
import TechStack from "../component/TechStack";


function Main(){
    return(
        <main>
                        
            <section className="hero two-col">
                {/* COLONNA SINISTRA: hero + pills con gradiente */}
                <div className="hero-left">
                    <div className="hero-grad" aria-hidden="true" />
                    <div className="hero-left-inner">
                    <h1 className="reveal">Siti Web e Integrazione IA nei processi produttivi</h1>
                    <p className="reveal delay-1">Aiuto le PMI a innovare con tecnologie moderne e scalabili.</p>

                    <div className="hero-badges">
                        <span className="pill primary">Ingegnere informatico • Web App & IA</span>
                        <span className="pill ok">Disponibile per nuovi progetti</span>
                    </div>
                    <div className="hero-template-pill reveal delay-2">
                        <span className="hero-template-pill__label">Cerchi ispirazione rapida?</span>
                        <Link to="/templates" className="hero-template-pill__link">Scopri alcuni Templates</Link>
                    </div>
                    </div>
                </div>
             
                {/* COLONNA DESTRA: punti + CTA */}
                <aside className="hero-right">
                   <h2>Benvenuto nel mio sito!</h2>
                    <p>Ciao, sono un ingegnere informatico indipendente specializzato nello sviluppo di soluzioni su misura per piccole e medie imprese. Offro servizi di progettazione e realizzazione di soluzioni IA per automazione dei processi produttivi, sviluppo web-app e creazione di siti web moderni e funzionali, con un approccio orientato all’efficienza, alla scalabilità e all’esperienza utente. Collaboro con aziende che vogliono portare innovazione nei propri processi, trasformare le idee in strumenti concreti e migliorare la propria presenza digitale.</p>
         


                    <div className="hero-ctas reveal delay-2">
                    <Link to="/servizi" className="btn">Scopri i servizi</Link>
                    <Link to="/contatti" className="btn secondary">Contattami</Link>
                    <Link to="/chi-sono" className="btn">Scopri di più su di me.</Link>
                    </div>
                    
                </aside>
                
        
                </section>
                <TechStack></TechStack> 
         
           
        </main>
    );
}

export default Main;
