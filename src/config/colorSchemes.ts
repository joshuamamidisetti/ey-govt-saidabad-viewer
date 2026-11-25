// Shared colour schemes for colour-coding buildings by a category attribute.
// Used by both layers.ts (default colouring) and the LegendControl (switch + legend).

export type ColourScheme = {
    field: string;
    categories: [string, string][]; // [value, colour]
};

export const colourSchemes: Record<string, ColourScheme> = {
    "Ownership": {
        field: "ownership",
        categories: [
            ["Government", "#1565c0"],
            ["Private", "#9e9e9e"],
            ["Public-Private", "#00897b"],
            ["Religious Trust", "#8e24aa"],
        ],
    },
    "Utilisation": {
        field: "utilisation",
        categories: [
            ["Fully Utilised", "#2e7d32"],
            ["Underutilised", "#f9a825"],
            ["Unused", "#c62828"],
        ],
    },
    "Development Status": {
        field: "development_status",
        categories: [
            ["Developed", "#2e7d32"],
            ["Under Development", "#1565c0"],
            ["Undeveloped", "#f9a825"],
            ["Dilapidated", "#c62828"],
        ],
    },
};

export const FALLBACK_COLOUR = "#90a4ae";

// Build a MapLibre fill-color expression that colours by category,
// while keeping the existing hover/selected highlight colours.
export function buildFillColour(scheme: ColourScheme): any {
    const match: any[] = ["match", ["get", scheme.field]];
    for (const [value, colour] of scheme.categories) {
        match.push(value, colour);
    }
    match.push(FALLBACK_COLOUR); // fallback for any unmatched value

    return [
        "case",
        ["boolean", ["feature-state", "hovered"], false], "#ffff00",
        ["boolean", ["feature-state", "selected"], false], "#ffa000",
        match,
    ];
}
