import type { LayerDefinition } from "../types/LayerDefinition";
import { colourSchemes, buildFillColour } from "./colorSchemes";

// All three Saidabad layers share one source ("saidabad") and are separated by the
// "layer_kind" property (buildings and the ward boundary are both polygons, so a
// geometry-type filter is not enough).
export const saidabadLayers: LayerDefinition[] = [
    {
        id: "saidabad-boundary",
        name: "Ward Boundary",
        sourceId: "saidabad",
        geometryType: "Polygon",
        visible: true,
        filter: ["==", ["get", "layer_kind"], "boundary"],
        style: {
            type: "line",
            paint: {
                "line-color": "#6a1b9a",
                "line-width": 3,
                "line-dasharray": [2, 1],
            },
        },
    },
    {
        id: "saidabad-roads",
        name: "Roads",
        sourceId: "saidabad",
        geometryType: "LineString",
        visible: true,
        filter: ["==", ["get", "layer_kind"], "road"],
        style: {
            type: "line",
            paint: {
                "line-color": [
                    "case",
                    ["boolean", ["feature-state", "hovered"], false],
                    "#ffff00",
                    ["boolean", ["feature-state", "selected"], false],
                    "#ffa000",
                    "#555555",
                ],
                "line-width": [
                    "case",
                    ["boolean", ["feature-state", "hovered"], false],
                    6,
                    ["boolean", ["feature-state", "selected"], false],
                    5,
                    2,
                ],
            },
        },
    },
    {
        id: "saidabad-buildings",
        name: "Buildings",
        sourceId: "saidabad",
        geometryType: "Polygon",
        visible: true,
        filter: ["==", ["get", "layer_kind"], "building"],
        style: {
            type: "fill",
            paint: {
                // Default: colour buildings by ownership category (switchable via the legend).
                "fill-color": buildFillColour(colourSchemes["Ownership"]),
                "fill-opacity": [
                    "case",
                    ["boolean", ["feature-state", "hovered"], false],
                    0.8,
                    ["boolean", ["feature-state", "selected"], false],
                    0.85,
                    0.55,
                ],
                "fill-outline-color": "#0d3c75",
            },
        },
    },
    {
        id: "saidabad-slums",
        name: "Slum Areas",
        sourceId: "saidabad",
        geometryType: "Polygon",
        visible: true,
        filter: ["==", ["get", "layer_kind"], "slum"],
        style: {
            type: "fill",
            paint: {
                "fill-color": [
                    "case",
                    ["boolean", ["feature-state", "hovered"], false],
                    "#ffff00",
                    ["boolean", ["feature-state", "selected"], false],
                    "#ffa000",
                    "#d84315",
                ],
                "fill-opacity": [
                    "case",
                    ["boolean", ["feature-state", "hovered"], false],
                    0.6,
                    ["boolean", ["feature-state", "selected"], false],
                    0.65,
                    0.4,
                ],
                "fill-outline-color": "#bf360c",
            },
        },
    },
];
