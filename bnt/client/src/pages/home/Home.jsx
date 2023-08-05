import FeaturedLocation from "../../components/featured/FeaturedLocation"
import FeaturedLodging from "../../components/featured/FeaturedLodging"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { NavBar } from "../../components/navbar/NavBar"
import "./home.css"
import { faArrowTrendUp, faAward, faLocationDot, faLocationPin } from "@fortawesome/free-solid-svg-icons"
import Footer from "../../components/footer/Footer"
import { useLocation } from "react-router-dom"


const Home = () => {
  const location = useLocation()

  return (
    <div>
      <NavBar/>
      <div className="homeContainer">
        
        <div className="homeTitleContainer">          
          <h1 className="homeTitle">
            <FontAwesomeIcon icon={faArrowTrendUp} className="titleIcon" />            
            Trending Destinations
          </h1>          
        </div>
        <FeaturedLocation/>


        <div className="homeTitleContainer">          
          <h1 className="homeTitle">
            <FontAwesomeIcon icon={faAward} className="titleIcon" />            
            Best choices
          </h1>          
        </div>
        <FeaturedLodging/>
      </div>
      <Footer/>
    </div>
  )
}

export default Home