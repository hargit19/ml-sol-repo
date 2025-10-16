import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import "../../css/Dashboard/Main.css";
import Map from "../Map/Map";
import Overlay from "./Overlay"; // Import the overlay component

function Main() {
  const [location, setLocation] = useState([]);
  const [showOverlay, setShowOverlay] = useState(true); // State to control overlay visibility

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setLocation([lat, lng]);
  };

  const overlayText = 
    "Welcome to the Map Dashboard! Click anywhere on the map to set a location marker. " +
    "You can also drag the marker to adjust its position. " +
    "To search for a specific location, click on the marker and use the search functionality. " +
    "Once you've set your location, you can upload data by clicking on the marker.";

  return (
    <>
      {showOverlay && <Overlay text={overlayText} />}
      <div className="main__container">
        <div className="main__header">
          <p style={{ marginLeft: "30%", color: "#1f1914" }}>
            Click or drag marker to desired location. You can search location also by clicking onto the marker. Upload
            data after location is set by clicking on marker.
          </p>
        </div>
        <div className="main__map">
          <Map handleMapClick={handleMapClick} location={location} />
        </div>
      </div>
    </>
  );
}

export default Main;