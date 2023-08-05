import axios from "axios"


export const lodging = async (req,res)=>{
    const strabonUrl = 'http://localhost:9999/Strabon/';
    const strabonquery = `
      #__________________________________________________________
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
  
  
      select ?name ?aswkt ?distance ?price ?neighbourhood
      ?rtype ?rating ?img ?number_of_reviews ?info ?amenities ?accommodates 
      ?bathrooms_text ?bedrooms ?hostName ?hostImg
      where {
        
        
        <http://my.project/lodging/id/${req.params.id}> rdf:type :lodging .
        <http://my.project/lodging/id/${req.params.id}> :hasLabel ?name .
        
        <http://my.project/lodging/id/${req.params.id}> geo:hasGeometry ?geom .
        ?geom geo:asWKT ?aswkt .
        
        <http://my.project/lodging/id/${req.params.id}> :hasPrice ?price .
        <http://my.project/lodging/id/${req.params.id}> :hasRoom_type ?rtype .
        <http://my.project/lodging/id/${req.params.id}> :hasNeighbourhood ?neighbourhood .
        optional {<http://my.project/lodging/id/${req.params.id}> :hasReview_scores_rating ?rating .}
        optional {<http://my.project/lodging/id/${req.params.id}> :hasImg ?img .}
        optional {<http://my.project/lodging/id/${req.params.id}> :hasNumber_of_reviews ?number_of_reviews.}
        optional {<http://my.project/lodging/id/${req.params.id}> :hasInfo ?info.}
        optional {<http://my.project/lodging/id/${req.params.id}> :hasAmenities ?amenities.}
        optional {<http://my.project/lodging/id/${req.params.id}> :hasAccommodates ?accommodates.}
        optional {<http://my.project/lodging/id/${req.params.id}> :hasBathrooms_text ?bathrooms_text.}
        optional {<http://my.project/lodging/id/${req.params.id}> :hasBedrooms ?bedrooms.}

        <http://my.project/lodging/id/${req.params.id}> :hasHost_id ?hostId .
        optional {?hostId :hasLabel ?hostName .}
        optional {?hostId :hasImg ?hostImg .}
     
        
      } limit 1
    `
  
    const fullQuery = strabonUrl 
                    + "Query?query=" + encodeURIComponent(strabonquery) 
                    + "&format=SPARQL/JSON"
    console.log(fullQuery)
    
    try {  
      const response = await axios.get(fullQuery);
      
      const ans = response.data;
      console.log("Answer is: " + ans)
      res.status(200).json(ans)
    }
    catch(err){
        console.log(err);
    }
}