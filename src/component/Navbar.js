import { Link } from "react-router-dom";

function Navbar(){
    return(
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/chi-sono">Chi Sono</Link></li>
                <li><Link to="/contatti">Contatti</Link></li>
                <li><Link to="/iot">IoT</Link></li>
                <li><Link to="/portfolio">Portfolio</Link></li>
                <li><Link to="/Servizi">Servizi</Link></li>
                <li><Link to="/webapp">WebApp</Link></li>
               
            </ul>
        </nav>
    );
}

export default Navbar;