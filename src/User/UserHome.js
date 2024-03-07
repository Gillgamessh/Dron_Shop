import {Link} from "react-router-dom";
import BackgroundImg from '../images/canvas.png';

function LandingPageButton() {    
  return <Link to="/User/Login" class="nav-link">
        <button class="btn btn-primary" > 
            <span style={{"font-size": "24px"}}>
                Click Me!
            </span>
        </button>
    </Link>
}function LandingFrameMessage() {    
  const style = {
        margin: "auto",
        padding: "10% 35% 10% 15%",
        color: "white"
    } ;   return <div style={style}>
        
        <div style={{"font-size": "76px"}}>
            Dron Shop
        </div>
        
        <div style={{"font-size": "30px"}}>
        This project is created to demonstrate the working of 
        React + ASP.Net Core + MsSQL on the example of buying drones
        </div>        <br />        <LandingPageButton />    </div>
}function LandingFrame() {
    const style = {
        "background-image": `url("${BackgroundImg}")`,
        "background-repeat": "no-repeat",
        backgroundSize: "cover",
    backgroundPosition: "center",
    height: "91.5vh", 
    position: "absolute",
    }  ;
      return <div style={style}>
        <LandingFrameMessage />
    </div>
}function HomePage() {
    return <div>
        <LandingFrame />
    </div>
}export default HomePage