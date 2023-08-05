import axios from "axios"


export const locations = async (req,res)=>{
    const strabonUrl = 'http://localhost:9999/Strabon/';
    const strabonquery = `
    #__________________________________________________________
    
    PREFIX lgd:<http://linkedgeodata.org/triplify/>
    PREFIX lgdgeo:<http://www.w3.org/2003/01/geo/wgs84_pos#>
    PREFIX lgdont:<http://linkedgeodata.org/ontology/>
    PREFIX geonames:<http://www.geonames.org/ontology#>
    PREFIX clc: <http://geo.linkedopendata.gr/corine/ontology#>
    PREFIX gag: <http://geo.linkedopendata.gr/greekadministrativeregion/ontology#>
    PREFIX geo: <http://www.opengis.net/ont/geosparql#>
    PREFIX geof: <http://www.opengis.net/def/function/geosparql/>
    PREFIX geor: <http://www.opengis.net/def/rule/geosparql/>
    PREFIX strdf: <http://strdf.di.uoa.gr/ontology#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    PREFIX uom: <http://www.opengis.net/def/uom/OGC/1.0/>
    PREFIX : <http://my.project/ontology#>
    
    select ?p ?name ?geom ?aswkt
    where {     
            
      ?p rdf:type :location .
      ?p :hasLabel ?name .
      ?p geo:hasGeometry ?geom .
      ?geom geo:asWKT ?aswkt .
    
   
    } 
    `
  
    const fullQuery = strabonUrl 
                    + "Query?query=" + encodeURIComponent(strabonquery) 
                    + "&format=SPARQL/JSON"
    console.log(fullQuery)
    
    try {  
      const response = await axios.get(fullQuery);
      
      const ans = response.data;
      res.status(200).json(ans)
    }
    catch(err){
        console.log(err);
    }
}
