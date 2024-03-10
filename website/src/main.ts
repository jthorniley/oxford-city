import L from "leaflet";
import "leaflet/dist/leaflet.css";
import oxfordWards from "./oxford-wards.json";
import results2022 from "./results-2022.json";
import "./styles.css";

function activateWard(wardName: string) {
  const wardResults = results2022[wardName] as any;
  if (wardResults !== undefined) {
    console.log(wardResults);
    const container = document.getElementById("info-container");
    if (container) {
      container.innerHTML = `
      <h3>${wardName}</h3>
      `
    }
  }
}

function createMap() {
  var map = L.map('map').setView([51.755409, -1.255782], 12);

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
          color: "red",
          opacity: 1,
          fill: true
        };
      },
      onEachFeature(feature, layer) {
        const wardName = feature.properties.Ward_name;

        layer.bindTooltip(wardName);

        layer.addEventListener("mouseover", () => activateWard(wardName));
      },
    }
  ).addTo(map);
}

createMap();

