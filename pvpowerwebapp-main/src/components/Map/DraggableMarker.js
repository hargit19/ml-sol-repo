import React, { useCallback, useEffect, useRef, useState } from "react";
import { Marker, Popup } from "react-leaflet";
import { toast } from "react-toastify";
import { getLatLngFromLocationFlow } from "../../api/openCageMapsFlow";
import { getMapDefaultLocationFlow } from "../../api/userFlow";
import "../../css/Map/DraggableMarker.css";
import FormDialog from "../Multi-StepForm/FormDialog";

function DraggableMarker({ location }) {
  const [position, setPosition] = useState([28.7041, 77.1025]);
  const draggable = true;
  const markerRef = useRef(null);
  const inputRef = useRef(null);

  const dragend = useCallback(() => {
    const marker = markerRef.current;
    if (marker !== null) {
      setPosition([marker.getLatLng().lat, marker.getLatLng().lng]);
    }
  }, []);

  const eventHandlers = { dragend };

  useEffect(() => {
    async function getInitialLocation() {
      const result = await getMapDefaultLocationFlow();

      if (result.status === "success") {
        setPosition([result.data.lat, result.data.long]);
      }
    }
    getInitialLocation();
  }, []);

  useEffect(() => {
    if (location[0] !== undefined) {
      setPosition([location[0], location[1]]);
    }
  }, [location]);

  async function handleLocationInput() {
    const inputLocation = inputRef.current.value;

    const result = await getLatLngFromLocationFlow(inputLocation);
    console.log(result);

    if (result.status.code === 200) {
      const { lat, lng } = result.results[0].geometry;
      setPosition([lat, lng]);
    } else {
      toast.warn("No results found for the provided location.");
    }
  }

  return (
    <Marker draggable={draggable} eventHandlers={eventHandlers} position={position} ref={markerRef}>
      <Popup minWidth={90}>
        <div>
          <br />
          <input type="text" ref={inputRef} placeholder="Enter location" style={{backgroundColor : "white" , borderColor : "gray" , color: "black" , height : "15px" , marginBottom : "3px" }} />
          <button onClick={handleLocationInput}>Search Location</button>
          <br />
          <span style={{ margin: "auto" }}>or</span>
          <br />
          <FormDialog lat={position[0]} long={position[1]} />
        </div>
      </Popup>
    </Marker>
  );
}

export default DraggableMarker;
