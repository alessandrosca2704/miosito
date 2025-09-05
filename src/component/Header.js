import { Link } from "react-router-dom";
import SideMenu from "./SideMenu";

 function Header(){
    return(
         
        <header className="topbar">
            <SideMenu/>
            <div className="topbarIcon">
            <Link to="/" >
            <img 
            src="/images/poi.jpg"
            alt="Foto profilo"
            style={{width:'12%', borderRadius:'45%', alignContent:'center', padding:'3%'}}
            />
           <h1 >Alessandro Scarimbolo</h1>
            </Link>
            </div>
        </header>
        
    );
 }

 export default Header;