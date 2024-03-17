import "leaflet/dist/leaflet.css";
import "./App.css";

import L from "leaflet";
import React from "react";

import oxfordWards from "./data/oxford-wards.json";
import results2022 from "./data/results-2022.json";

type WardName = keyof typeof results2022;

type Party = "LAB" | "GRN" | "CON" | "LD" | "IND" | "TUSC";

const DEFAULT_COLOR: string = "#aaaaaa";

function getPartyColor(party: Party): string {
  if (party === "LAB") {
    return "#d41a24";
  } else if (party === "GRN") {
    return "#4ab316";
  } else if (party === "CON") {
    return "#168bb3";
  } else if (party === "LD") {
    return "#e0c324";
  } else if (party === "TUSC") {
    return "#423311";
  } else if (party === "IND") {
    return "#555555"
  }
  // unknown
  return DEFAULT_COLOR;
}

type CandidateEntry = {
  lastName: string
  names: string
  description: string
  party: Party
  votes: number
  elected: boolean

}

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

type CandidateProps = {
  candidate: CandidateEntry
}

function Candidate(props: CandidateProps) {
  const { candidate } = props;

  return (<>
    <div>
      <span className="candidateName">{candidate.lastName}</span>
      <span className="candidateParty">{candidate.party}</span>
      <span className="candidateVotes">{candidate.votes}</span>
      {candidate.elected && <span className="candidateElected">*</span>}
    </div>
  </>)
}

type CandidatesProps = {
  candidates: Array<CandidateEntry>
}

function Candidates(props: CandidatesProps) {
  const { candidates } = props;


  return (
    <>
      {candidates.map((candidate: CandidateEntry, idx: number) => <Candidate key={idx} candidate={candidate} />)}
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

type AppState = {
  map: L.Map | null
  currentWard: WardName | null
  currentLayer: L.Layer | null
}

type AppAction = "INIT" | { highlightWard: [WardName, L.Layer] | null };

function App() {
  const mapRef = React.useRef<HTMLElement>(null);
  //const [map, setMap] = React.useState<L.Map | null>(null);
  // const [currentWard, setCurrentWard] = React.useState<WardName | null>(null);
  //const [layer, setLayer] = React.useState<L.Layer | null>(null);

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

      L.geoJSON(oxfordWards as any,
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
          onEachFeature(feature, layer) {
            layer.addEventListener("mouseover", () => {
              dispatch({ highlightWard: [feature.properties.Ward_name, layer] });
            })
          },
        }
      ).addTo(map);
      return {
        ...state, map
      };
    }
    else if ('highlightWard' in action) {
      if (action.highlightWard === null) {
        return { ...state, currentLayer: null, currentWard: null }
      } else {
        return {
          ...state, currentWard: action.highlightWard[0], currentLayer: action.highlightWard[1]
        }
      }
    }

    throw new Error("unexpected action")

  }

  const [state, dispatch] = React.useReducer(AppReducer, { map: null } as AppState)

  React.useEffect(() => {
    if (mapRef.current) {
      dispatch("INIT");
    }
  }, [mapRef])

  return (
    <>
      <header className="app">
        <h1>Oxford City Council</h1>
      </header>
      <main className="app">
        {
          state.currentWard && state.currentLayer && state.map && (
            <WardTooltip wardName={state.currentWard} map={state.map} layer={state.currentLayer} />
          )
        }
        < section id="map" ref={mapRef}></section>
      </main >
    </>
  )
}

export default App
