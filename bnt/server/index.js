import express from "express"
import featuredRoute from "./routes/featured.js"
import lodgingRoute from "./routes/lodging.js"
import otherRoute from "./routes/other.js"
import poisRoute from "./routes/pois.js"
import locationsRoute from "./routes/locations.js"
import resultsRoute from "./routes/results.js"


const app = express()


const connect = async ()=>{ // 
  try{
      
  } catch(error){
      throw error;
  }
}


app.listen(8808, ()=>{
  connect()
  console.log("Connected to backend");  
})


app.use("/featured", featuredRoute)

app.use("/lodgings", lodgingRoute)

app.use("/other", otherRoute)

app.use("/pois", poisRoute)

app.use("/locations", locationsRoute)

app.use("/results", resultsRoute)

