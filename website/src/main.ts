import L from "leaflet";
import "leaflet/dist/leaflet.css";
import oxfordWards from "./oxford-wards.json";
import "./styles.css";


function createMap() {
  var map = L.map('map').setView([51.755409, -1.255782], 12);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  L.geoJSON(oxfordWards,
    {
      style: (feature) => {
        console.log(feature)
        return {
          stroke: true,
          weight: 2,
          color: "red",
          opacity: 1,
          fill: true
        };
      }
    }
  ).addTo(map);
}

createMap();

