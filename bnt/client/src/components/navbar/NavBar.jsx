import "./navbar.css"
import "../../general.css"
import { faCalendarDays, faPerson, faPlane, faSearch} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { DateRange } from "react-date-range";
import { format } from "date-fns"
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css';
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Select from 'react-select'
import axios from 'axios'



export const NavBar = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const page = location.pathname.split("/")[1]

    /* Search bar */
        /* Destination */
    useEffect(()=>{
        try {
            getLocations();            
        } catch (error) { 
            console.log(error); 
        }
    }, [])
    const [destination, setDestination] = useState("")
    const [locations,setLocations] = useState([])
    const getLocations = async () => {
        try {
            const res = await axios.get(`/locations`);
            var hintArray = []
            res.data.features.map(a => hintArray.push({value : a.properties.name , label : a.properties.name} ))
            setLocations(hintArray)
        } catch (error) {
            console.log("During request an error occured: " + error.message)
        }
    }
        /* Calendar */
    const [openCalendar, setOpenCalendar] = useState(false); 
    const [dates, setDates] = useState([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: 'selection'
        }
    ]);
    
        /* Guests */
    const [openGuests, setOpenGuests] = useState(false); 
    const [guests, setGuests]= useState({
        adults: 1,
        children: 0
    })
    const handleGuests = (name, operator) => {
        setGuests(prev=>{return{
            ...prev, [name]: operator ==="plus" ? guests[name] +1 : guests[name] -1
        }})
    } 
        /* Search button */
    const handleSearch = () => {
        window.scrollTo(0, 0);       
        if (destination)
            navigate("/results", {state: {destination, dates, guests}});      
            
        if (page=="results"){
            navigate(0, {state: {destination, dates, guests}})
        }
    }
    const handleLogoClick = () => {
        setGuests({adults: 1, children: 0})
        setDates([
            {
              startDate: new Date(),
              endDate: new Date(),
              key: 'selection'
            }
        ])
        setDestination("")
        window.scrollTo(0, 0);
        navigate("/", {state: { destination , dates, guests}});
        
    }

    return (
      <div className="navbar disable-select">
        <div className="navbarContainer">
            
            <div className="logoContainer" onClick={handleLogoClick}>
                <div className="logo">bnt</div>
                <div className="miniLogo">book and travel</div>
            </div>
            
            <div className="searchContainer">
                <div className="searchItem">
                    <FontAwesomeIcon icon={faPlane} className="searchBarIcon" />
                    <div className="searchDestinationBox">
                        <Select                                 
                            menuPortalTarget={document.body} 
                            styles={{ menuPortal: base => ({ ...base, zIndex: 999}) }}
                            options={locations} 
                            placeholder="Destination" 
                            onChange={event => (setDestination(event.value))}
                        />
                    </div>
                </div>                
                <div className="searchItem">
                    <FontAwesomeIcon icon={faCalendarDays} className="searchBarIcon" />
                    <div onClick={() => setOpenCalendar(!openCalendar)} className="searchText">{`${format(dates[0].startDate, "dd/MM/yyyy")} - ${format(dates[0].endDate, "dd/MM/yyyy")}`}</div>
                    {openCalendar && 
                        <DateRange 
                            className="dateBox"
                            editableDateInputs={true}
                            onChange={item => setDates([item.selection])}
                            moveRangeOnFirstSelection={false}
                            ranges={dates}
                            minDate = {new Date()}                                                                                 
                        />                    
                    }
                </div>
                <div className="searchItem">
                    <FontAwesomeIcon  icon={faPerson} className="searchBarIcon" />
                    <div onClick={() => setOpenGuests(!openGuests)} className="searchText">adults: {guests.adults}, children: {guests.children}</div>
                    {openGuests && <div className="guestsBox">
                        <div className="guestsBoxItem">
                            <span>Adults:</span>
                            <button disabled={ guests.adults <= 1 } onClick={() => handleGuests("adults", "minus")} className="guestsCounterButton">-</button>
                            <div className="guestsCounterNumber">{guests.adults}</div>
                            <button disabled={ guests.adults >= 16 } onClick={() => handleGuests("adults", "plus")} className="guestsCounterButton">+</button>
                        </div>
                        <div className="guestsBoxItem">
                            <span>Children:</span>
                            <button disabled={ guests.children <= 0 } onClick={() => handleGuests("children", "minus")} className="guestsCounterButton">-</button>
                            <div className="guestsCounterNumber">{guests.children}</div>
                            <button disabled={ guests.children >= 16 } onClick={() => handleGuests("children", "plus")} className="guestsCounterButton">+</button>
                        </div>
                    </div> }
                </div>
                <button className="searchButton" onClick={handleSearch}>
                    <FontAwesomeIcon icon={faSearch}/>
                </button>

            </div>
            <div className="userButtonContainer">
                <button className="userButton">Register</button>
                <button className="userButton">Login</button>
                
            </div>
        </div>
      </div>
              
    )
}
