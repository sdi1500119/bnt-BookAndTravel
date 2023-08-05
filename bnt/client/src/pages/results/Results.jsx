import FiltersBox from "../../components/filters/FiltersBox"
import Footer from "../../components/footer/Footer"
import { useLocation } from "react-router-dom"
import List from "../../components/list/List"
import { NavBar } from "../../components/navbar/NavBar"
import "./results.css"

const Results = () => {
  const location = useLocation()
  return (
        <div className="resultsContainer">
            <NavBar/>
            <div className="resultsWrapper">
              <FiltersBox state={location.state}/>
              <List state={location.state}/>
            </div>
            <Footer/>

        </div>
  )
}

export default Results