import React from "react";
import { CandidateEntry, getPartyColor } from "./parties";

type ChartProps = {
    candidates: CandidateEntry[]
}

export function Chart(props: ChartProps) {
    const sortedCandidates = [...props.candidates];

    sortedCandidates.sort((a, b) => Math.sign(b.votes - a.votes))

    var totalVotes = 0;
    for (const candidate of sortedCandidates) {
        totalVotes += candidate.votes;
    }

    const bars: React.ReactElement[] = []
    var i = 0;
    for (const candidate of sortedCandidates) {
        const pct = Math.ceil((candidate.votes / totalVotes) * 100)
        i = i + 1;
        bars.push(
            <React.Fragment key={i}>
                <div style={{ width: "20px", height: `${100 - pct}px` }}></div>
                <div style={{ width: "20px", height: `${pct}px`, backgroundColor: getPartyColor(candidate.party) }}></div>
                <div style={{ height: "20px", fontSize: 9 }}>{pct} {candidate.elected && "*"}</div>
            </React.Fragment>
        )
    }


    return (
        <>
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "wrap",
                    height: "120px",
                    alignItems: "center",
                    width: `${bars.length * 20}px`
                }}>
                    {bars}
                </div>
                <div>%</div>
            </div>
        </>
    )
}