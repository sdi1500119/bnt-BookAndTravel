import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"
import { useEffect } from "react";
import Home from "./pages/home/Home";
import Results from "./pages/results/Results";
import axios from "axios"
import Lodging from "./pages/lodging/Lodging";


const api = axios.create({
  baseURL: `http://localhost:9999/Strabon/Query`
})

function App() {
  useEffect(() => {
    document.title = "Bnt | Book and travel."
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/results" element={<Results/>}/>    
        <Route path="/lodgings/:id" element={<Lodging/>}/>
      </Routes>
    </BrowserRouter>

  );
}

export default App;
