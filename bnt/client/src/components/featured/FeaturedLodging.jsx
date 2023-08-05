import { faLocationDot, faLocationPin } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DateRange } from "react-date-range";
import "./featuredlodging.css";


const FeaturedLodging = () => {
    const navigate = useNavigate();
    useEffect(()=>{
        try {
            getFeat();
            
        } catch (error) { 
            console.log(error); 
        }
    }, [])

    const[feat,setFeat] = useState([])
    const [loaded, setLoaded] = useState(false)

    const getFeat = async () => {
        try {
            const res = await axios.get("/featured");
            setFeat (res) 
            setLoaded(true)
        } catch (error) {
            console.log("During request an error occured: " + error.message)
        }
    }

    const [dates, setDates] = useState([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: 'selection'
        }
    ]);
    
    const [guests, setGuests]= useState({
        adults: 1,
        children: 0
    })

    const [destination, setDestination] = useState("None")
    
    const handleClickOnLodging = async (id) => {
        var shortId = id.replace('http://my.project/lodging/id/','')
        window.scrollTo(0, 0);

        navigate(`/lodgings/${shortId}`, {state: { destination, dates, guests }})
    }


    return(
        
        <div className="featuredLodgingContainer">
          
            <div className="featuredLodgingWrapper">
                {loaded && feat.data.map((flodging) => (
                    <div className="featuredLodgingItem" key={flodging.properties.p}>
                        <img 
                            onClick={()=>{handleClickOnLodging(flodging.properties.p)}}
                            src={flodging.properties.img}
                            alt="" 
                            className="featuredLodgingImg" 
                        />
                        <span className="featuredLodgingName" onClick={()=>{handleClickOnLodging(flodging.properties.p)}}>{flodging.properties.name}</span>
                        <span className="featuredLodgingCity"><FontAwesomeIcon icon={faLocationDot} className="titleIcon" />{flodging.properties.neighbourhood}</span>
                        <span className="featuredLodgingPrice">Book now for €{flodging.properties.price} <small>(per night)</small></span>
                        <div className="featuredLodgingRating">
                            <button>{flodging.properties.rating}</button>
                            <span>({flodging.properties.number_of_reviews} reviews)</span>
                        </div>
                    </div>                                   
                ))}
            </div>
                      
        </div>
            
     
    )
}

export default FeaturedLodging