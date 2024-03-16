import "leaflet/dist/leaflet.css";
import "./App.css";

import L from "leaflet";
import React from "react";

import oxfordWards from "./data/oxford-wards.json";
import results2022 from "./data/results-2022.json";

type WardName = keyof typeof results2022;

type CandidateEntry = {
  lastName: string
  names: string
  description: string
  party: string
  votes: number
  elected: boolean

}

type CandidateProps = {
  candidate: CandidateEntry
}

function Candidate(props: CandidateProps) {
  const { candidate } = props;

  return (<>
    <div>{candidate.lastName}</div>
  </>)
}

type CandidatesProps = {
  candidates: Array<CandidateEntry>
}

function Candidates(props: CandidatesProps) {
  const { candidates } = props;


  return (
    <>
      {candidates.map((candidate: CandidateEntry) => <Candidate key={candidate.lastName} candidate={candidate} />)}
    </>
  )
}

type WardTooltipProps = {
  map: L.Map
  layer: L.Layer
  wardName: WardName
}

function WardTooltip(props: WardTooltipProps) {
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const { map, layer, wardName } = props;

  React.useEffect(() => {
    if (!tooltipRef.current) {
      return;
    }

    layer.bindPopup(tooltipRef.current!).openPopup()
  }, [tooltipRef, map, layer]);

  const data = results2022[wardName];

  return (
    <>
      <div ref={tooltipRef}>
        {wardName}
        {data && <Candidates candidates={data.candidates} />}
      </div>
    </>
  )
}

function App() {
  const mapRef = React.useRef<HTMLElement>(null);
  const [map, setMap] = React.useState<L.Map | null>(null);
  const [currentWard, setCurrentWard] = React.useState<WardName | null>(null);
  const [layer, setLayer] = React.useState<L.Layer | null>(null);

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
    if (map === null) {
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
          layer.addEventListener("mouseover", () => {
            setCurrentWard(feature.properties.Ward_name);
            setLayer(layer);
          })
        },
      }
    ).addTo(map);

  }, [map, setCurrentWard, setLayer])

  return (
    <>
      <header className="app">
        <h1>Oxford City Council</h1>
      </header>
      <main className="app">
        {currentWard && layer && map && (
          <WardTooltip wardName={currentWard} map={map} layer={layer} />
        )}
        <section id="map" ref={mapRef}></section>
      </main>
    </>
  )
}

export default App
