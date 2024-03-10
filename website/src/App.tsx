import "leaflet/dist/leaflet.css";
import "./App.css";

import L from "leaflet";
import React from "react";

import oxfordWards from "./data/oxford-wards.json";

function App() {
  const mapRef = React.useRef<HTMLElement>(null);
  const [map, setMap] = React.useState<L.Map| null>(null);

  // Initialise map
  React.useEffect(() => {
    if (mapRef.current === null || map !== null) {
      return;
    }

    while (mapRef.current.firstChild !== null) {
      mapRef.current.removeChild(mapRef.current.firstChild);
    }
    const mapEl = document.createElement("div")
    mapRef.current.appendChild(mapEl);
    setMap(L.map(mapEl).setView([51.755409, -1.255782], 12));
  }, [map, setMap, mapRef]);

  React.useEffect(() => {
    if (map === null ) {
      return;
    }
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    L.geoJSON(oxfordWards as any,
      {
        style: () => {
          return {
            stroke: true,
            weight: 1,
            color: "#33bbaa",
            opacity: 1,
            fill: true
          };
        },
        onEachFeature(feature, layer) {
          const wardName = feature.properties.Ward_name;
  
          layer.bindPopup(wardName);
          },
      }
    ).addTo(map);
  
  }, [map])

  return (
    <>
    <header className="app">
      <h1>Oxford City Council</h1>      
    </header>
    <main className="app">
      <section id="map" ref={mapRef}></section>
    </main>
    </>
  )
}

export default App
