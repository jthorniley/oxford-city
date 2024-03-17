import "leaflet/dist/leaflet.css";
import "./App.css";

import L from "leaflet";
import React from "react";
import { CandidateEntry, DEFAULT_COLOR, getPartyColor } from "./parties";

import { Chart } from "./Chart";
import oxfordWards from "./data/oxford-wards.json";
import results2022 from "./data/results-2022.json";

type WardName = keyof typeof results2022;



function getWinner(wardName: WardName): CandidateEntry | null {
  const ward = results2022[wardName]
  if (ward === undefined) {
    return null;
  }

  const localCandidates = ward.candidates;
  if (ward === undefined) {
    return null;
  }

  for (const candidate of localCandidates) {
    if (candidate.elected) {
      return candidate as CandidateEntry
    }
  }

  return null
}

type WardTooltipProps = {
  layer: L.Layer
}

function WardTooltip(props: WardTooltipProps) {
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const { layer } = props;
  const wardName: WardName = (layer as any).feature.properties.Ward_name;
  React.useEffect(() => {
    if (!tooltipRef.current) {
      return;
    }

    const popup = L.popup();
    layer.bindPopup(popup)
    popup.setContent(tooltipRef.current!)
    layer.openPopup()
    layer.closePopup()
    tooltipRef.current.style["display"] = "block";
  }, [tooltipRef, layer])

  const data = results2022[wardName];

  return (
    <>
      <div ref={tooltipRef} style={{ display: "none" }}>
        <div>{wardName}</div>
        {data && <Chart candidates={data.candidates as any} />}
      </div>
    </>
  )
}

type AppState = {
  map: L.Map | null
  wardLayers: L.Layer[]
}

type AppAction = "INIT";

function App() {
  const mapRef = React.useRef<HTMLElement>(null);

  function AppReducer(state: AppState, action: AppAction): AppState {
    if (action === "INIT") {
      while (mapRef.current!.firstChild !== null) {
        mapRef.current!.removeChild(mapRef.current!.firstChild);
      }
      const mapEl = document.createElement("div")
      mapRef.current!.appendChild(mapEl);

      const map = L.map(mapEl);
      map.setView([51.755409, -1.255782], 12)

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      const geoJSON = L.geoJSON(oxfordWards as any,
        {
          style: (feature) => {
            var color = DEFAULT_COLOR;
            if (feature) {
              const ward = feature.properties.Ward_name;
              const winner = getWinner(ward);
              if (winner) {
                color = getPartyColor(winner.party);
              }
            }
            return {
              stroke: true,
              color: "black",
              opacity: 0.9,
              weight: 0.5,

              fill: true,
              fillColor: color,
              fillOpacity: 0.5,
            };
          },
        }
      ).addTo(map);

      return {
        ...state, map, wardLayers: geoJSON.getLayers()
      };
    }

    throw new Error("unexpected action")

  }

  const [state, dispatch] = React.useReducer(AppReducer, { map: null, wardLayers: [] } as AppState)

  React.useEffect(() => {
    if (mapRef.current) {
      dispatch("INIT");
    }
  }, [mapRef])

  return (
    <>
      <main className="app">
        {
          state.wardLayers.map((layer, index) => <WardTooltip key={index} layer={layer} />)
        }
        <section id="map" ref={mapRef}></section>
      </main >
    </>
  )
}

export default App
