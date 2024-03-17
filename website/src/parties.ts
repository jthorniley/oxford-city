export type Party = "LAB" | "GRN" | "CON" | "LD" | "IND" | "TUSC";

export const DEFAULT_COLOR: string = "#aaaaaa";

export function getPartyColor(party: Party): string {
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
export type CandidateEntry = {
    lastName: string
    names: string
    description: string
    party: Party
    votes: number
    elected: boolean

}
