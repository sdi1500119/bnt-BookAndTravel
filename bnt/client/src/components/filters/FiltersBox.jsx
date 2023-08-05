import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import "./filtersbox.css"
import { format } from "date-fns";
import Select from 'react-select'
import axios from 'axios'

const FiltersBox = () => {
    const navigate = useNavigate()
    
    const location = useLocation()
    const page = location.pathname.split("/")[1]
    const [nearPoi, setNearPoi] = useState(location.state.nearPoi || {id:undefined,name:undefined})
    const [max, setMax] = useState(location.state.max||undefined);
    const [min, setMin] = useState(location.state.min||undefined);
    const [destination, setDestination] = useState (location.state.destination)
    const [dates, setDates] = useState(location.state.dates)
    const [guests, setGuests] = useState(location.state.guests)
    const adults = 0, children = 1;
    
    const [rtype, setRtype] = useState(location.state.rtype||"All")
    const rtypes = [{ value: "All", label: "All" },
                    { value: "Entire home/apt", label: "Entire home/apt" },
                    { value: "Private room", label: "Private room" },
                    { value: "Shared room", label: "Shared room" },
                    { value: "Hotel room", label: "Hotel room" }]
    
    const [distance, setDistance] = useState(location.state.distance||100)
    const distances = [{ value: 100, label: "100" },
                    { value: 250, label: "250" },
                    { value: 500, label: "500" },
                    { value: 1000, label: "1000" },
                    { value: 2000, label: "2000" }]
                    
    
    const [POInearme, setPOInearme] = useState(location.state.POInearme||'-')
    const POISnearme = [{ value: "-", label: "-" },
                    { value: "fuel", label: "fuel" },
                    { value: "pharmacy", label: "pharmacy" },
                    { value: "parking", label: "parking" },
                    { value: "cafe", label: "cafe" },
                    { value: "fitness_centre", label: "fitness_centre" },
                    { value: "hospital", label: "hospital" }]
    
    const [amenities, setAmenities] = useState(location.state.amenities||[])
    var tmp=amenities;
    const handleAmenities = (opt) => {
        const index = tmp.indexOf(opt);
        if (index > -1) { // only splice array when item is found
            tmp.splice(index, 1); // 2nd parameter means remove one item only
            setAmenities(tmp)
        }
        else{
            tmp.push(opt)
            setAmenities(tmp)
        }
    }

    const isChecked = (opt) => {
        
        const index = amenities.indexOf(opt);
        if (index > -1) { 
            return true;
        }
        else{
            return false;
        }
    }

    
        /* Search button */
    const handleSearch = () => {
        window.scrollTo(0, 0);
        setAmenities(tmp)
        let amen=amenities.toString()
        let numofguests = guests[children] + guests[adults]
        navigate("/results", {state: {destination, nearPoi, dates, guests, min, max, rtype, amenities, POInearme, distance}});      
                
    }

    return (
        <div className="filtersBoxContainer">
            <div className="filtersBox">
                <div className="filtersBoxTitle">Search Details</div>
                <div className="filterItem">
                    <div className="filterTitle">Near </div>
                    <div className="filterChoise">{nearPoi.id !== undefined ? nearPoi.name : destination}</div>
                </div>
                <div className="filterItem">
                    <div className="filterTitle">Dates </div>
                    <div className="filterChoise">{format(dates[0].startDate, "dd/MM/yyyy")} to {format(dates[0].endDate, "dd/MM/yyyy")}</div>
                </div>
                <div className="filterItem">
                    <div className="filterTitle">Guests</div>
                    <div className="filterChoise">{guests.adults} adults - {guests.children} children</div>
                </div>
                <div className="filtersBoxTitle">Filters</div>
                <div className="filterItem">
                    <h2 className="filterTitle">Room type</h2>
                    <div className="filterChoise">
                        <Select                                 
                            menuPortalTarget={document.body} 
                            styles={{ menuPortal: base => ({ ...base, zIndex: 999}) }}
                            options={rtypes}
                            placeholder =  {location.state.rtype} 
                            defaultValue = {location.state.rtype} 
                            onChange={event => (setRtype(event.value))}                         
                        />
                    </div>
                </div>

                <div className="filterItem">
                    <h2 className="filterTitle">Amenities</h2>
                    <div className="filterChoise">
                        <input className="filterCheckbox" type="checkbox" defaultChecked={isChecked("Wifi")} onChange={() => {handleAmenities("Wifi")}}/>Wi-fi<br />
                        <input className="filterCheckbox" type="checkbox" defaultChecked={isChecked("Air conditioning")} onChange={() => {handleAmenities("Air conditioning")}} />Air cond/ning<br />
                        <input className="filterCheckbox" type="checkbox" defaultChecked={isChecked("Elevator")} onChange={() => {handleAmenities("Elevator")}} />Elevator<br />
                        <input className="filterCheckbox" type="checkbox" defaultChecked={isChecked("Kitchen")} onChange={() => {handleAmenities("Kitchen")}} />Kitchen<br />
                        <input className="filterCheckbox" type="checkbox" defaultChecked={isChecked("TV")} onChange={() => {handleAmenities("TV")}} />TV<br />
                        <input className="filterCheckbox" type="checkbox" defaultChecked={isChecked("Free street parking")} onChange={() => {handleAmenities("Free street parking")}} />Parking<br />
                    </div>
                </div>

                <div className="filterItem">  
                    <h2 className="filterTitle">Min price*</h2>
                    
                    <div className="filterChoise"><input className="filterPrice" type="number" defaultValue={location.state.min} onChange={e=>setMin(e.target.value)} min={0} max={9999}/></div>                     
                </div>
                <div className="filterItem">  
                    <h2 className="filterTitle">Max price*<br/><small><i>*per night</i></small> </h2>
                    <div className="filterChoise"><input className="filterPrice" type="number" defaultValue={location.state.max} onChange={e=>setMax(e.target.value)} min={0} max={9999}/></div>                    
                </div>

                { 
                    ( <div className="filterItem">
                        <h2 className="filterTitle">Near me</h2>
                        <div className="filterChoise">
                            <Select                                 
                                menuPortalTarget={document.body} 
                                styles={{ menuPortal: base => ({ ...base, zIndex: 999}) }}
                                options={POISnearme} 
                                placeholder = {POInearme}
                                defaultValue = {POInearme} 
                                onChange={event => (setPOInearme(event.value))}                        
                            />
                        </div>                    
                    </div> )
                }
                { POInearme !== '-' && 
                    (<div className="filterItem">  
                        <h2 className="filterTitle">Distance<br/> (meters)</h2>
                        <div className="filterChoise">
                            <Select                                 
                                menuPortalTarget={document.body} 
                                styles={{ menuPortal: base => ({ ...base, zIndex: 999}) }}
                                options={distances} 
                                placeholder = {distance}
                                defaultValue = {distance} 
                                onChange={event => (setDistance(event.value))}                        
                            />    
                        </div>                     
                    </div>)
                }

                <button onClick={handleSearch}>Search</button>

            </div>

        </div>
    )
}

export default FiltersBox