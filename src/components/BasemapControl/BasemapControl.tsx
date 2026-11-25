import type * as maplibregl from "maplibre-gl";
import { toolContainer, toolButton, toolFlyout } from "../toolStyles";

type BasemapControlProps = {
        map: maplibregl.Map | null;
        open: boolean;
        onToggle: () => void;
};

const basemaps = {
        Liberty: "https://tiles.openfreemap.org/styles/liberty",
        Positron: "https://tiles.openfreemap.org/styles/positron",
        Dark: "https://tiles.openfreemap.org/styles/dark",
        Light: "https://tiles.openfreemap.org/styles/light",
};

function BasemapControl({ map, open, onToggle }: BasemapControlProps) {

        const changeBasemap = (styleUrl: string) => {
                if (!map) return;
                map.setStyle(styleUrl);
        };

        return (
                <div style={toolContainer(50)}>
                        <button style={toolButton(open)} onClick={onToggle}>Basemap</button>
                        {open && (
                                <div style={toolFlyout}>
                                        <strong>Select Basemap</strong>
                                        {Object.entries(basemaps).map(([name, url]) => (
                                                <button key={name} onClick={() => changeBasemap(url)} style={{
                                                        display: "block",
                                                        width: "100%",
                                                        marginTop: "6px",
                                                        padding: "5px 8px",
                                                        cursor: "pointer",
                                                }}>
                                                        {name}
                                                </button>
                                        ))}
                                </div>
                        )}
                </div>
        );
}

export default BasemapControl;
