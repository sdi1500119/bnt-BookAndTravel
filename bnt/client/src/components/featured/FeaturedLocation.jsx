import "./featuredlocation.css"

import athens from "./img/athens.jpg"
import thessaloniki from "./img/thessaloniki.jpg"
import crete from "./img/crete.jpg"
import south_aegean from "./img/santorini.jpg"

const FeaturedLocation = () => {


    return (
        <div className="FeaturedLocationContainer">
            <div className="featuredLocationRow">
                
                    <div className="featuredLocationItem">
                        <img src={athens} 
                            alt="" className="featuredLocationImg" />
                        <div className="featuredLocationTitles">
                            Athens
                            
                            
                        </div>
                    </div>
                    <div className="featuredLocationItem">
                        <img src={thessaloniki} 
                            alt="" className="featuredLocationImg" />
                        <div className="featuredLocationTitles">
                            Thessaloniki
                            
                            
                        </div>
                    </div>
                   
                    
                
            </div>
            <div className="featuredLocationRow">
                    <div className="featuredLocationItem">
                        <img src={crete} 
                            alt="" className="featuredLocationImg" />
                        <div className="featuredLocationTitles">
                            Crete
                            
                            
                        </div>
                    </div>
                    
                    <div className="featuredLocationItem">
                        <img src={south_aegean}
                            alt="" className="featuredLocationImg" />
                        <div className="featuredLocationTitles">
                            South Aegean
                            
                            
                        </div>
                    </div>
            </div>
        </div>
    )
}

export default FeaturedLocation