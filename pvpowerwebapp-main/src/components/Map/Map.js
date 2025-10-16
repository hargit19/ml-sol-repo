import React from "react";
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import kashmir_json from "../../Geojson";
import "../../css/Map/Map.css";
import DraggableMarker from "./DraggableMarker";

function Map({ handleMapClick, location }) {
  const geoj = kashmir_json;

  return (
    <MapContainer
      className="map__container"
      center={[28.7041, 77.1025]}
      zoom={5}
      scrollWheelZoom={true}
      preferCanvas={true}
      whenReady={(map) => {
        map.target.on("click", function (e) {
          handleMapClick(e);
        });
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON
        data={geoj}
        style={(feature) => ({
          color: "#cebfca",
          fillOpacity: 0.1,
        })}
      />
      <DraggableMarker location={location} />
    </MapContainer>
  );
}

export default Map;
