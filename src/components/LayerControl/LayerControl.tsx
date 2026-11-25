import { useState } from "react";
import type * as maplibregl from 'maplibre-gl';
import { toolContainer, toolButton, toolFlyout } from "../toolStyles";

interface LayerControlProps {
        map: maplibregl.Map | null;
        open: boolean;
        onToggle: () => void;
}

function LayerControl({ map, open, onToggle }: LayerControlProps) {
        const [layers, setLayers] = useState({
                buildings: true,
                slums: true,
                roads: true,
                boundary: true,
        });

        const toggleLayer = (
                layerId: string,
                key: "buildings" | "slums" | "roads" | "boundary",
        ) => {
                if (!map) return;
                const newVisibility = layers[key] ? "none" : "visible";
                map.setLayoutProperty(layerId, "visibility", newVisibility);
                setLayers((previous) => ({ ...previous, [key]: !previous[key] }));
        };

        return (
                <div style={toolContainer(10)}>
                        <button style={toolButton(open)} onClick={onToggle}>Layers</button>
                        {open && (
                                <div style={toolFlyout}>
                                        <strong>Layers</strong>
                                        <label style={{ display: "block", marginTop: "10px" }}>
                                                <input type="checkbox" checked={layers.buildings}
                                                        onChange={() => toggleLayer("saidabad-buildings", "buildings")} />
                                                {" "}Buildings
                                        </label>
                                        <label style={{ display: "block", marginTop: "10px" }}>
                                                <input type="checkbox" checked={layers.slums}
                                                        onChange={() => toggleLayer("saidabad-slums", "slums")} />
                                                {" "}Slum Areas
                                        </label>
                                        <label style={{ display: "block", marginTop: "10px" }}>
                                                <input type="checkbox" checked={layers.roads}
                                                        onChange={() => toggleLayer("saidabad-roads", "roads")} />
                                                {" "}Roads
                                        </label>
                                        <label style={{ display: "block", marginTop: "10px" }}>
                                                <input type="checkbox" checked={layers.boundary}
                                                        onChange={() => toggleLayer("saidabad-boundary", "boundary")} />
                                                {" "}Ward Boundary
                                        </label>
                                </div>
                        )}
                </div>
        );
}

export default LayerControl;
