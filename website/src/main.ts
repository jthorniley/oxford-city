import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./styles.css";

function createMap() {
  var map = L.map('map').setView([51.755409, -1.255782], 13);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
}

createMap();

