import { Link } from "react-router-dom";
import { navbarItems } from "../data/navigation";

function Navbar(){
    return(
        <nav>
            <ul>
                {navbarItems.map((item) => (
                    <li key={item.to}>
                        <Link to={item.to}>{item.label}</Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default Navbar;
