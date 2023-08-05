import { useEffect, useState } from "react";
import { faBathtub, faBed, faBinoculars, faCheckCircle, faCircleCheck, faEye, faHouse, faInfo, faInfoCircle, faLocationDot, faMap, faPerson, faPlusCircle, faStar } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Footer from "../../components/footer/Footer"
import { NavBar } from "../../components/navbar/NavBar"
import { Map, MapContainer, Marker, Popup, TileLayer} from "react-leaflet"
import {Icon} from 'leaflet'
import axios from "axios"
import "../../components/featured/featuredlodging.css";

import 'leaflet/dist/leaflet.css'

import lodging_marker from "./img/lodging-marker.png"
import car from "./img/car.png"
import art_culture from "./img/art-culture.png"
import health from "./img/health.png"
import sports_recreation from "./img/sports-recreation.png"
import eat_drink from "./img/eat-drink.png"
import religion from "./img/religion.png"
import black_marker from "./img/black-marker.png"

import "./lodging.css" 
import { useLocation, useNavigate } from "react-router-dom";




const Lodging = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const id = location.pathname.split("/")[2]
    const [destination, setDestination] = useState (location.state.destination)
    //const [max, setMax] = useState(location.state.max);
    //const [min, setMin] = useState(location.state.min);
    const [guests, setGuests] = useState(location.state.guests)
    const [dates, setDates] = useState(location.state.dates)
    //const [rtype, setRtype] = useState("All")
    //const [distance, setDistance] = useState(100)
    //const [POInearme, setPOInearme] = useState('-')
    const [nearPoi, setNearPoi] = useState({id:undefined,name:undefined})
        
    const [amenities, setAmenities] = useState([]) 
    
    useEffect(()=>{
        try {
            if (nearPoi.id !== undefined)
                navigate("/results", {state: {destination, dates, guests, nearPoi}} )           
        } catch (error) { 
            console.log(error); 
        }
    }, [nearPoi])

    useEffect(()=>{
        try {
                getLodging();
                getOther();
            
        } catch (error) { 
            console.log(error); 
        }
    }, [id])
 
    const [lodging,setLodging] = useState([])
    //const [destination,setDestination] = useState(location.state.destination)
    const [other,setOther] = useState([])
    const [lodgingLoaded, setLodgingLoaded] = useState(false)
    const [otherLoaded, setOtherLoaded] = useState(false)

    const getLodging = async () => {
        try {
            const res = await axios.get(`/lodgings/${id}`);
            setLodging (res)
            setLodgingLoaded(true)
        } catch (error) {
            console.log("During request an error occured: " + error.message)
        }
    }

    const getOther = async () => {
        try {
            const res = await axios.get(`/other/${id}`);
            setOther (res)
            setOtherLoaded(true)
        } catch (error) {
            console.log("During request an error occured: " + error.message)
        }
    }
    
    const arrayAmen = (str) => {
        str = str.replace(/", "/g, ', ');
        str = str.replace(/\[\"/g, ' ');
        str = str.replace(/\"\]/g, ' ');
        str = str.replace(/\\/g, '');
        const strArray = str.split(", ");
        return strArray
    }
    
    const arrayInfo = (str) => {
        str = str.replace(/<b>/g, '');
        str = str.replace(/<\/b>/g, '');
        
        const strArray = str.split("<br />");
        return strArray
    }

    const [markers,setMarkers] = useState([])
    const [markersLoaded, setMarkersLoaded] = useState(false)

    const handleClickPoi = async (poiCategory,distance) => {
        setMarkers([])
        setMarkersLoaded(false)
        try {
            const res = await axios.get(`/pois/${poiCategory}/${distance}/${id}`);
            setMarkers (res)
            setMarkersLoaded(true)
        } catch (error) {
            console.log("During request an error occured: " + error.message)
        }
    }

    const handleClickPopup = async(id) => {
        
    }
    
    const handleClickOnLodging = async (id) => {
        var shortId = id.replace('http://my.project/lodging/id/','')
        window.scrollTo(0, 0);
        navigate(`/lodgings/${shortId}`, {state: {destination, dates, guests, nearPoi}})
    }  

    return (
        <div className="lodgingContainer">
            <NavBar/>
            <div className="lodgingWrapper">
            
                {
                lodgingLoaded && lodging.data.features.map((lod) => (
                    <>
                        <h1 className="lodgingTitle" key={lod.id}>
                        {lod.properties.name}
                        </h1>
                
                        <div className="basicInfo">   
                            <div className="location">
                                <FontAwesomeIcon icon={faLocationDot} className="locationIcon" />
                                <span>{lod.properties.neighbourhood}</span>
                                <FontAwesomeIcon icon={faHouse} className="locationIcon" />
                                <span>{lod.properties.rtype}</span> 
                            </div>     
                            <div className="rating">
                                <span>{lod.properties.number_of_reviews} reviews</span>
                                <button><FontAwesomeIcon icon={faStar}/> {lod.properties.rating} </button>
                            </div>
                        </div>
                        <div className="lodgingImagesWrapper">
                            <img 
                                src={lod.properties.img} 
                                alt="" 
                                className="lodgingImageCentral" 
                            />
                            <div className="sideLodgingImagesWrapper">
                                <img 
                                    src={lod.properties.img}  
                                    alt="" 
                                    className="sideLodgingImage" 
                                />
                                <img 
                                    src={lod.properties.img}
                                    alt="" 
                                    className="sideLodgingImage" 
                                />
                            </div>
                        </div>
                    
                        <div className="lodgingDetailsContainer">

                            <div className="lodgingDetailsLeft"> 
                            <div className="infoItem"><FontAwesomeIcon icon={faPerson} className="icon"/>Guests: {lod.properties.accommodates}</div>
                                <div className="infoItem"><FontAwesomeIcon icon={faBed} className="icon"/>Bedrooms: {lod.properties.bedrooms}</div>
                                <div className="infoItem"><FontAwesomeIcon icon={faBathtub} className="icon"/>Bathrooms: {lod.properties.bathrooms_text} </div>                   
                                
                                <div className="lodgingDescription">
                                    <FontAwesomeIcon icon={faInfoCircle} className="icon"/>
                                    {arrayInfo(lod.properties.info).map((sentence)=>(
                                        <div>{sentence}</div>))}
                                </div>
                                <div className="infoItem">
                                    <FontAwesomeIcon icon={faPlusCircle} className="icon"/>
                                    Amenities: 
                                    <div className="amenities">
                                        {arrayAmen(lod.properties.amenities).map((amenity)=>(                                       
                                            
                                            <div className="amenity"><FontAwesomeIcon icon={faCheckCircle} className="icon"/>{amenity}</div>
                                            
                                        ))}                               
                                    </div>
                                </div>
                            </div>
                            <div className="lodgingDetailsRight">
                                <div className="hostInfo">
                                        <img 
                                            src={lod.properties.hostImg} 
                                            alt="" 
                                            className="hostImage"
                                        />
                                        <span className="hostName">Host: {lod.properties.hostName}</span>                        
                                </div>
                                
                                <button className="bookNow">Book now for ${lod.properties.price}  <small>(price per night)</small></button>
                            </div>
                            
                        </div>
                                       
                        <div className="mapPoiContainer">
                            <FontAwesomeIcon icon={faMap} className="icon"/>Map 
                            {markersLoaded && (<span className="cleanMap" onClick={()=>{setMarkers([]); setMarkersLoaded(false)}}>Clean map</span>)}
                            <MapContainer  
                                className="mapCon"                  
                                center={[ lod.geometry.coordinates[1] , lod.geometry.coordinates[0] ]}
                                zoom={14}
                                minZoom={12}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker key={id}
                                    position = {[ lod.geometry.coordinates[1] , lod.geometry.coordinates[0] ]}
                                    eventHandlers={{
                                        popupopen: (e) => {
                                            e.popup._closeButton.removeAttribute("href");
                                            e.popup._closeButton.style.cursor = "pointer";
                                        }
                                    }} 
                                    icon={new Icon({iconUrl: lodging_marker, iconSize: [49, 51], iconAnchor: [12, 41]})}
                                />
                                {markersLoaded && markers.data.features.map((poiMarker)=>(
                                    <Marker 
                                        position = {[ poiMarker.geometry.coordinates[1] , poiMarker.geometry.coordinates[0] ]} 
                                        eventHandlers={{ 
                                            popupopen: (e) => {
                                                e.popup._closeButton.removeAttribute("href"); // prevent #close (source: https://stackoverflow.com/questions/72020795/how-can-i-disable-or-change-the-href-on-a-react-leaflet-v4-popup-close-button)
                                                e.popup._closeButton.style.cursor = "pointer";
                                            }
                                        }}
                                        icon={new Icon({iconUrl: black_marker, iconSize: [49, 51], iconAnchor: [12, 41]})}
                                    >
                                        <Popup onClick={() => {handleClickPopup(poiMarker.properties.p)}}>
                                            <b>{poiMarker.properties.name }</b>
                                            
                                            {poiMarker.properties.category === 'religion' && <> ({poiMarker.properties.amenity}) <br /> Building: {poiMarker.properties.building} <br /> Religion: {poiMarker.properties.religion} </> }
                                            {poiMarker.properties.category === 'art,culture' && <><br />{poiMarker.properties.hypernym} <img src={poiMarker.properties.img} alt=""/> <div className="poiInfo">{poiMarker.properties.info}</div> </> }
                                            {poiMarker.properties.category === 'sports,recreation' && <> ({poiMarker.properties.leisure}) <br /> {poiMarker.properties.tourism} </> }
                                            {poiMarker.properties.category === 'health' && <> ({poiMarker.properties.amenity}) <br /> Phone: {poiMarker.properties.phone} <br /> Building: {poiMarker.properties.building}</> }
                                            {poiMarker.properties.category === 'car' && <> ({poiMarker.properties.amenity}) <br /> Brand: {poiMarker.properties.brand} <br /> Phone:{poiMarker.properties.phone} <br /> Website: {poiMarker.properties.website}  <br /> Building: {poiMarker.properties.building}</> }
                                            {poiMarker.properties.category === 'eat,drink' && <> ({poiMarker.properties.amenity}) <br /> Cuisine: {poiMarker.properties.cuisine} <br /> Outdoor seating: {poiMarker.properties.outdoor_seating} <br /> Phone: {poiMarker.properties.phone} <br /> Website: {poiMarker.properties.website}</> }
                                            <br />
                                            <button className="nearPoiSearch" onClick={() => { setNearPoi({id:poiMarker.properties.p,name:poiMarker.properties.name}) }}>Search for lodgings nearby</button>
                                            
                                        </Popup>
                                    </Marker>
                                ))

                                }
                            </MapContainer>
                        </div>
                        <div className="poiMenu">
                            <div className="poiMenuTitle">
                                <FontAwesomeIcon icon={faBinoculars} className="titleIcon" />
                                What's nearby 
                            </div>
                            <div className="poiButtonsContainer">                    
                                <div onClick = { () => {handleClickPoi('religion',1000)} } className="poiButton">
                                    <img src={religion} alt="" className="poiIcon"/>
                                    <p>Religion</p>
                                </div>      
                                <div onClick = { () => {handleClickPoi('art,culture',2000)} } className="poiButton">
                                    <img src={art_culture} alt="" className="poiIcon"/>
                                    <p>Art, Culture</p>
                                </div>               
                                <div onClick = { () => {handleClickPoi('health',1000)} } className="poiButton">
                                    <img src={health} alt="" className="poiIcon"/>
                                    <p>Health</p>
                                </div>
                                <div onClick = { () => {handleClickPoi('sports,recreation',1000)} } className="poiButton">
                                    <img src={sports_recreation} alt="" className="poiIcon"/>
                                    <p>Sports, Recreation</p>
                                </div>
                                <div onClick = { () => {handleClickPoi('car',1000)} } className="poiButton">
                                    <img src={car} alt="" className="poiIcon"/>
                                    <p>Car</p>
                                </div>
                                <div onClick = { () => {handleClickPoi('eat,drink',300)} } className="poiButton">
                                    <img src={eat_drink} alt="" className="poiIcon"/>
                                    <p>Eat, drink</p>
                                </div>
                            </div>
                        </div>
                    
                
                        <div className="otherLodgings">
                            <div><FontAwesomeIcon icon={faHouse} className="titleIcon" />
                                Other choices nearby
                            </div>
                            
                                
                                    <div className="featuredLodgingContainer">
                                    <div className="featuredLodgingWrapper">  
                                        {
                                        otherLoaded && other.data.features.map((oth) => (
                                            <>  
                                                <div className="featuredLodgingItem" key={oth.properties.p}>
                                                    <img 
                                                        onClick={()=>{handleClickOnLodging(oth.properties.p)}}
                                                        src={oth.properties.img}
                                                        alt="" 
                                                        className="featuredLodgingImg" 
                                                    />
                                                    <span className="featuredLodgingName" onClick={()=>{handleClickOnLodging(oth.properties.p)}}>{oth.properties.name}</span>
                                                    <span className="featuredLodgingCity"><FontAwesomeIcon icon={faLocationDot} className="titleIcon" />Distance from the current point: {Math.round(oth.properties.distance)}m </span>
                                                    <span className="featuredLodgingPrice">Book now for €{oth.properties.price}</span>
                                                    <div className="featuredLodgingRating">
                                                        <button>{oth.properties.rating}</button>
                                                        <span>({oth.properties.number_of_reviews} reviews)</span>
                                                    </div>
                                                </div> 
                                            </>
                                        ))}
                                        </div> 
                                    </div> 
                                
                                

                        </div>
                    
                    </>            
                ))}    
            </div>
            <Footer/>
        </div>
    )
}

export default Lodging