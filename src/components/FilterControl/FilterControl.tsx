import { useState } from "react";
import type * as maplibregl from "maplibre-gl";
import saidabad from "../../data/saidabad.json";
import { toolContainer, toolButton, toolFlyout } from "../toolStyles";

type FilterControlProps = {
        map: maplibregl.Map | null;
        open: boolean;
        onToggle: () => void;
};

// Attributes the user can filter buildings by (config object, like `basemaps`).
const buildingFilters = {
        "Ownership": { field: "ownership", values: ["Government", "Private", "Public-Private", "Religious Trust"] },
        "Utilisation": { field: "utilisation", values: ["Fully Utilised", "Underutilised", "Unused"] },
        "Development Status": { field: "development_status", values: ["Developed", "Under Development", "Undeveloped", "Dilapidated"] },
};

type Attribute = keyof typeof buildingFilters;

const buildings = (saidabad as any).features.filter(
        (f: any) => f.properties?.layer_kind === "building"
);
const TOTAL = buildings.length;

function FilterControl({ map, open, onToggle }: FilterControlProps) {

        const [attribute, setAttribute] = useState<Attribute>("Ownership");
        const [value, setValue] = useState("All");
        const [count, setCount] = useState(TOTAL);

        const applyFilter = (attr: Attribute, val: string) => {
                if (!map) return;
                const field = buildingFilters[attr].field;

                if (val === "All") {
                        map.setFilter("saidabad-buildings", ["==", ["get", "layer_kind"], "building"]);
                        setCount(TOTAL);
                } else {
                        map.setFilter("saidabad-buildings", [
                                "all",
                                ["==", ["get", "layer_kind"], "building"],
                                ["==", ["get", field], val],
                        ]);
                        setCount(buildings.filter((f: any) => f.properties?.[field] === val).length);
                }
        };

        const changeAttribute = (attr: Attribute) => {
                setAttribute(attr);
                setValue("All");
                applyFilter(attr, "All");
        };

        const changeValue = (val: string) => {
                setValue(val);
                applyFilter(attribute, val);
        };

        const clearFilter = () => changeValue("All");

        const selectStyle: React.CSSProperties = {
                display: "block",
                width: "100%",
                marginTop: "6px",
                padding: "5px 8px",
                cursor: "pointer",
        };

        return (
                <div style={toolContainer(90)}>
                        <button style={toolButton(open)} onClick={onToggle}>Filter</button>
                        {open && (
                                <div style={toolFlyout}>
                                        <strong>Filter Buildings</strong>

                                        <select value={attribute} onChange={(e) => changeAttribute(e.target.value as Attribute)} style={selectStyle}>
                                                {Object.keys(buildingFilters).map((name) => (
                                                        <option key={name} value={name}>{name}</option>
                                                ))}
                                        </select>

                                        <select value={value} onChange={(e) => changeValue(e.target.value)} style={selectStyle}>
                                                <option value="All">All</option>
                                                {buildingFilters[attribute].values.map((v) => (
                                                        <option key={v} value={v}>{v}</option>
                                                ))}
                                        </select>

                                        <button onClick={clearFilter} style={{ ...selectStyle, marginTop: "8px" }}>
                                                Clear filter
                                        </button>

                                        <div style={{ marginTop: "8px", fontSize: "12px", color: "#333" }}>
                                                {value === "All"
                                                        ? `Showing all ${TOTAL} buildings`
                                                        : `${count} of ${TOTAL} buildings match`}
                                        </div>
                                </div>
                        )}
                </div>
        );
}

export default FilterControl;
