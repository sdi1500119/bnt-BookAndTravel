import axios from "axios"


export const results = async (req,res)=>{
    var {guests,min,max,rtype,amen,POInearme,distance,nearPoi,POInearme, ...others} = req.query;
    if (max === 'undefined' || max==="")
        max = 9999;
    if (min === 'undefined' || min==="")
        min = 0;
    const amenities = amen.split(",")
    

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

    select DISTINCT ?p ?name ?dist ?price ?guests ?rtype 
            ?aswkt ?img ?neighbourhood ?rating 
            ?reviews 
            ?nearPoiName 
    where {   
        ${POInearme != '' && POInearme != 'undefined' && POInearme != '-' ? 
            `   ?poi rdf:type :poi .
                ?poi geo:hasGeometry ?poigeom .
                ?poigeom geo:asWKT ?poiaswkt .
                ?poi :hasAmenity "${POInearme}"^^xsd:string .
                ` : ''}
        ${nearPoi != "undefined" ? 
                `
                <${nearPoi}> :hasLabel ?nearPoiName .
                <${nearPoi}> geo:hasGeometry ?fgeom .
                ?fgeom geo:asWKT ?faswkt .
                `
                :
                `
                ?location :hasLabel "${req.params.id}"^^<http://www.w3.org/2001/XMLSchema#string> .
                ?location geo:hasGeometry ?fgeom .
                ?fgeom geo:asWKT ?faswkt . 
        `}
        ?p rdf:type :lodging .
        ?p :hasLabel ?name .
        
        ?p geo:hasGeometry ?geom .
        ?geom geo:asWKT ?aswkt .
        
                
        ?p :hasReview_scores_rating ?rating .
        ?p :hasNumber_of_reviews ?reviews .
        ?p :hasNeighbourhood ?neighbourhood .
        ?p :hasImg ?img .
        ?p :hasPrice ?price .
        ?p :hasAccommodates ?guests .
        ?p :hasAmenities ?amen .
        ?p :hasRoom_type ?rtype .
        ${nearPoi !== "undefined" ? `BIND (geof:distance(?aswkt, ?faswkt, uom:metre) as ?dist ) . FILTER ( ?dist <= 120 ) .` : `FILTER (geof:distance(?aswkt, ?faswkt, uom:metre) <= 600 ) .`}

        ${rtype != '' && rtype != 'undefined' && rtype != 'All' ? `FILTER (?rtype = "${rtype}") .` : ''}
    
        
        ${guests != '' && guests != 'undefined' && guests >= 1 ? `FILTER (?guests >= ${guests}) .` : ''}
        ${amen != "" && amen != "undefined" ? (function a() {  
                            let str = ""        
                            for (let i=0; i < amenities.length; i++) { 
                                str += `FILTER (regex (str(?amen), "${amenities[i]}")) . 
                                `;
                             }
                             return str;
                        }
            )() : ""}
        
        FILTER (?price <= ${max} ) .        
        FILTER (?price >= ${min} ) .   
        
        ${POInearme != '' && POInearme != 'undefined' && POInearme != '-' ? 
            `
            FILTER (geof:distance(?aswkt, ?poiaswkt, uom:metre)  <= ${distance}) .
            ` : ''}
        
        BIND(IF(bound(?nearPoiName), ?nearPoiName, \" \" ) as ?nearPoiName) .
        
    }  order by desc(?price)
    
    `
    
    const fullQuery = strabonUrl 
                    + "Query?query=" + encodeURIComponent(strabonquery) 
                    + "&format=SPARQL/JSON"
    console.log(strabonquery)
    try {  
      const response = await axios.get(fullQuery);   
      await res.status(200).json(response.data)  
    }
    catch(err){
        console.log(err);
    }
    
}
