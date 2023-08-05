import { useEffect, useState } from "react"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import "./list.css"
import axios from 'axios'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faArrowRight, faHouse, faHouseChimney, faLocation, faLocationDot, faMapPin, faStar } from "@fortawesome/free-solid-svg-icons"

const List = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [destination, setDestination] = useState (location.state.destination)
    const [max, setMax] = useState(location.state.max);
    const [min, setMin] = useState(location.state.min);
    const [dates, setDates] = useState(location.state.dates)
    const [nearPoi, setNearPoi] = useState(location.state.nearPoi || {id:undefined,name:undefined})
    const [rtype, setRtype] = useState(location.state.rtype||"All")
    const [distance, setDistance] = useState(location.state.distance||100)
    const [POInearme, setPOInearme] = useState(location.state.POInearme||'-')
    const [amenities, setAmenities] = useState(location.state.amenities||[]) 

    const [guests, setGuests] = useState(location.state.guests)
    const adults=0, children=1;
    const [results, setResults] = useState([])
    const [listLoaded, setListLoaded] = useState(false)
    const [list, setList] = useState ([])
    const [currentPage, setCurrentPage] = useState(1)
    const [lodgingsPerPage, setLodgingsPerPage] = useState(10)
    const [currentLodgings, setCurrentLodgings] = useState([])
    const [totalLodgings, setTotalLodgings] = useState(0)
    
    // Get current page's lodgings
    const indexOfLastLodging = currentPage * lodgingsPerPage - 1;
    const indexOfFirstLodging = indexOfLastLodging - lodgingsPerPage + 1;

    useEffect(()=>{
            setListLoaded(false)


    }, [location.state.min, location.state.max, location.state.rtype, location.state.amenities, location.state.POInearme, location.state.distance])
 
    useEffect(()=>{
        try {
            if (listLoaded){
                getPage();
                setListLoaded(true)
            }
        } catch (error) { 
            console.log(error); 
        }
    }, [currentPage])

    useEffect(()=>{
        if (!listLoaded)
        {
            getList();
            setCurrentPage(1)
        }
        
   
    }, [listLoaded])

    const getList = async () => {
        try {
            if (!listLoaded){
                let numofguests = guests.children + guests.adults       
                let amen=amenities.toString()
                const res = await axios.get(`/results/${destination}?guests=${numofguests}&min=${location.state.min}&max=${location.state.max}&rtype=${location.state.rtype}&amen=${amen}&POInearme=${location.state.POInearme}&distance=${location.state.distance}&nearPoi=${nearPoi.id}`);
                setResults(res)
                setTotalLodgings(res.data.features.length)
                setList (res.data.features.slice(indexOfFirstLodging, indexOfLastLodging+1))
            }
            else {
                getPage()
            }
            setListLoaded(true)
        } catch (error) {
            console.log("During request an error occured: " + error.message)
        }
    }

    const getPage = async () => {
        setList (results.data.features.slice(indexOfFirstLodging, indexOfLastLodging+1))

    }
   
    
    const handleClickOnLodging = async (id) => {
        var shortId = id.replace('http://my.project/lodging/id/','')
        window.scrollTo(0, 0);

        navigate(`/lodgings/${shortId}`, {state: {destination, dates, guests}} )
    }   


    return (
        <div className="listContainer">
            {!listLoaded ? (<div className="loading">Loading...</div>) : list.map((item) => (
                <div className="listItem" key = {item.properties.p}>
                    <img 
                        onClick={ () => {handleClickOnLodging( item.properties.p ) } }
                        src={item.properties.img} 
                        alt="" 
                        className="listItemImage" 
                    />
                    <div className="listItemCenter">
                        <h1 className="listItemTitle" onClick={ () => {handleClickOnLodging( item.properties.p ) } }>
                            {item.properties.name}    
                        </h1>
                        <span className="listItemNeighbourhood">
                            <FontAwesomeIcon  icon={faLocationDot} className="icon" />
                            {item.properties.neighbourhood}
                            <FontAwesomeIcon  icon={faHouseChimney} className="icon" />
                            {item.properties.rtype}
                        </span>
                        <span className="listItemDescription">
                            Up to {item.properties.guests} guests.
                        </span>
                        {nearPoi.id !== undefined && <span className="listItemDescription">
                             {Math.round(item.properties.dist)}m from {nearPoi.name}
                        </span>}
                    </div>    
                    <div className="listItemRight">
                        
                        <div className="listItemRating">
                        <button>{item.properties.rating}<FontAwesomeIcon  icon={faStar} className="icon"/></button> 
                            ({item.properties.reviews} reviews)
                            
                        </div>
                        <div className="listItemRightDown">
                            <div className="listItemPrice">
                                {item.properties.price}€<small> per night</small>
                            </div>
                            
                            <div className="listItemBookNowButton" onClick={ () => {handleClickOnLodging( item.properties.p ) } }>
                                Book Now 
                            </div>
                        </div>
                    </div>        
                </div>
            ))}
            <div className="pageSelectMenu">
                {(indexOfFirstLodging > 0) && 
                    <button className="pageButton" onClick={()=>{ setCurrentPage(currentPage-1)}}>
                        <FontAwesomeIcon icon={faArrowLeft}/>
                    </button>}
                {(listLoaded && totalLodgings > 0) && 
                    <button className="pageButton">
                        {currentPage}/{Math.ceil(totalLodgings/lodgingsPerPage)}
                    </button>}
                {(listLoaded && totalLodgings === 0) && 
                    <div>
                        No results found...
                    </div>}
                {(listLoaded && indexOfLastLodging < totalLodgings-1) &&
                    <button className="pageButton" onClick={()=>{ setCurrentPage(currentPage+1)}}>
                        <FontAwesomeIcon icon={faArrowRight}/>
                    </button>}
            </div>
        </div>

    )
}

export default List