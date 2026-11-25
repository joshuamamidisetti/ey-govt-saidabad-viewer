import { useState } from "react";
import type * as maplibregl from "maplibre-gl";
import { colourSchemes, buildFillColour } from "../../config/colorSchemes";
import { toolContainer, toolButton, toolFlyout } from "../toolStyles";

type LegendControlProps = {
        map: maplibregl.Map | null;
        open: boolean;
        onToggle: () => void;
};

type Scheme = keyof typeof colourSchemes;

function LegendControl({ map, open, onToggle }: LegendControlProps) {

        const [scheme, setScheme] = useState<Scheme>("Ownership");

        const changeScheme = (name: Scheme) => {
                setScheme(name);
                if (!map) return;
                map.setPaintProperty(
                        "saidabad-buildings",
                        "fill-color",
                        buildFillColour(colourSchemes[name])
                );
        };

        const categories = colourSchemes[scheme].categories;

        return (
                <div style={toolContainer(130)}>
                        <button style={toolButton(open)} onClick={onToggle}>Legend</button>
                        {open && (
                                <div style={toolFlyout}>
                                        <strong>Colour by</strong>

                                        <select
                                                value={scheme}
                                                onChange={(e) => changeScheme(e.target.value as Scheme)}
                                                style={{
                                                        display: "block",
                                                        width: "100%",
                                                        marginTop: "6px",
                                                        marginBottom: "8px",
                                                        padding: "5px 8px",
                                                        cursor: "pointer",
                                                }}
                                        >
                                                {Object.keys(colourSchemes).map((name) => (
                                                        <option key={name} value={name}>{name}</option>
                                                ))}
                                        </select>

                                        {categories.map(([value, colour]) => (
                                                <div key={value} style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "5px" }}>
                                                        <span style={{
                                                                display: "inline-block",
                                                                width: "14px",
                                                                height: "14px",
                                                                background: colour,
                                                                border: "1px solid #999",
                                                                flex: "0 0 auto",
                                                        }} />
                                                        <span style={{ fontSize: "12px", color: "#333" }}>{value}</span>
                                                </div>
                                        ))}
                                </div>
                        )}
                </div>
        );
}

export default LegendControl;
