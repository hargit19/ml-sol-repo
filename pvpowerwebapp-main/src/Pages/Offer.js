import React from "react";
import "../css/Pages/Offer.css";

function Offer() {
  return (
    <div className="offer__section">
      <div className="offer__title">
        <h2>Real Time Weather Forecast</h2>
        <div className="offer__underline"></div>
      </div>
      
      <div className="offer__container">
        <div className="offer__content">
          <div className="offer__badge">Live Integration</div>
          <p>
            Experience live weather integration within our forecasting system, courtesy of our collaboration 
            with IIT Roorkee. Our platform provides real-time weather insights crucial for accurate PV power 
            predictions.
          </p>
          <div className="offer__features">
            <div className="offer__feature">
              <div className="offer__feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v2"></path>
                  <path d="M12 20v2"></path>
                  <path d="m4.93 4.93 1.41 1.41"></path>
                  <path d="m17.66 17.66 1.41 1.41"></path>
                  <path d="M2 12h2"></path>
                  <path d="M20 12h2"></path>
                  <path d="m6.34 17.66-1.41 1.41"></path>
                  <path d="m19.07 4.93-1.41 1.41"></path>
                  <circle cx="12" cy="12" r="4"></circle>
                </svg>
              </div>
              <span>Real-time Updates</span>
            </div>
            <div className="offer__feature">
              <div className="offer__feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 10h-4V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v6H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v6a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-6h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2z"></path>
                </svg>
              </div>
              <span>Enhanced Accuracy</span>
            </div>
            <div className="offer__feature">
              <div className="offer__feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                  <line x1="16" y1="8" x2="2" y2="22"></line>
                  <line x1="17.5" y1="15" x2="9" y2="15"></line>
                </svg>
              </div>
              <span>Customizable Views</span>
            </div>
          </div>
        </div>
        
        <div className="offer__map">
          <iframe
            title="Windy_Map"
            width="100%"
            height="100%"
            src="https://embed.windy.com/embed2.html?lat=29.864&lon=77.896&detailLat=29.864&detailLon=77.896&width=650&height=450&zoom=9&level=surface&overlay=gust&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default Offer;