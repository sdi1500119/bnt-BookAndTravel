import axios from "axios"


export const pois = async (req,res)=>{
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
    
    select ?p ?name ?geom ?aswkt ?distance ?category 
    ?brand ?amenity 
    ?cuisine ?website ?outdoor_seating ?opening_hours ?phone
    ?building ?leisure ?tourism
    ?img ?info ?hypernym
    
    where {     
             
              
        <http://my.project/lodging/id/${req.params.id}> geo:hasGeometry ?fgeom .
             ?fgeom geo:asWKT ?faswkt .  
        

      ${req.params.poiCategory !== 'art,culture' ? 
        ` 
        ?p rdf:type :poi .
        ?p :hasLabel ?name .
        ?p geo:hasGeometry ?geom .
        ?geom geo:asWKT ?aswkt .
        `
        : 
        `
        ?p rdf:type :tourist-attraction .
        ?p :hasLabel ?name .
        ?p geo:hasGeometry ?geom .
        ?geom geo:asWKT ?aswkt .
        `
      }

      optional { ?p :hasBuilding  ?building . } 
      optional { ?p :hasImg  ?img . }
      optional { ?p :hasInfo  ?info . }
      optional { ?p :hasWebsite  ?website . }
      optional { ?p :hasAmenity   ?amenity . } .
      optional { ?p :hasBrand   ?brand . } .
      optional { ?p :hasLeisure    ?leisure . }
      optional { ?p :hasOutdoor_seating    ?outdoor_seating . }
      optional { ?p :hasReligion    ?religion . }
      optional { ?p :hasOpening_hours    ?opening_hours . }
      optional { ?p :hasPhone ?phone . }
      optional { ?p :hasCuisine ?cuisine . } 
      optional { ?p :hasTourism ?tourism . }
      optional { ?p :hasHypernym ?hypernym . }

    
      ?p :hasCategory "${req.params.poiCategory}"^^xsd:string . 
      ?p :hasCategory ?category . 
    
      FILTER (geof:distance(?aswkt, ?faswkt, uom:metre) <= ${req.params.distance}) .
      BIND(IF(bound(?brand), ?brand, \" \" ) as ?brand) .
      BIND(IF(bound(?amenity), ?amenity, \" \" ) as ?amenity) .
      BIND(IF(bound(?cuisine), ?cuisine, \" \" ) as ?cuisine) .
      BIND(IF(bound(?building), ?building, \" \" ) as ?building) .
      BIND(IF(bound(?website), ?website, \" \" ) as ?website) .
      BIND(IF(bound(?leisure), ?leisure, \" \" ) as ?leisure) .
      BIND(IF(bound(?outdoor_seating), ?outdoor_seating, \" \" ) as ?outdoor_seating) .
      BIND(IF(bound(?religion), ?religion, \" \" ) as ?religion) .
      BIND(IF(bound(?opening_hours), ?opening_hours, \" \" ) as ?opening_hours) .
      BIND(IF(bound(?phone), ?phone, \" \" ) as ?phone) .
      BIND(IF(bound(?tourism), ?tourism, \" \" ) as ?tourism) .
      BIND(IF(bound(?img), ?img, \" \" ) as ?img) .
      BIND(IF(bound(?info), ?info, \" \" ) as ?info) .
      BIND(IF(bound(?hypernym), ?hypernym, \" \" ) as ?hypernym) .

    } 
    `
  
    const fullQuery = strabonUrl 
                    + "Query?query=" + encodeURIComponent(strabonquery) 
                    + "&format=SPARQL/JSON"
    console.log(fullQuery)
    console.log(strabonquery)
    
    try {  
      const response = await axios.get(fullQuery);
      
      const ans = response.data;
      res.status(200).json(ans)
    }
    catch(err){
        console.log(err);
    }
}


