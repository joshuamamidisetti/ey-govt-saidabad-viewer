import MapComponent from "./components/Map/MapComponent";
import { useState } from "react";
import FeatureInfo from "./components/FeatureInfo/FeatureInfo";
import LayerControl from "./components/LayerControl/LayerControl";
import type * as maplibregl from "maplibre-gl";
import Search from "./components/Search/Search";
import BasemapControl from "./components/BasemapControl/BasemapControl";
import FilterControl from "./components/FilterControl/FilterControl";
import LegendControl from "./components/LegendControl/LegendControl";
import AnalysisControl from "./components/AnalysisControl/AnalysisControl";
import type { IdentifyResult } from "./types/IdentifyResult";
import IdentifyResults from "./components/IdentifyResults/IdentifyResult";

function App() {

        const [selectedFeature, setSelectedFeature] = useState<IdentifyResult | null>(null);
        const [map, setMap] = useState<maplibregl.Map | null>(null);
        const [searchValue, setSearchValue] = useState("");
        const [clearMapSelection, setClearMapSelection] = useState<(() => void) | null>(null);
        const [zoomToFeature, setZoomToFeature] = useState<(() => void) | null>(null);
        const [ selectMapFeature, setSelectMapFeature ] = useState<((feature: IdentifyResult) => void) | null>(null);
        const [identifyResults, setIdentifyResults] = useState<IdentifyResult[]>([]);
        const [hoveredFeature, setHoveredFeature] = useState<IdentifyResult | null>(null);
        const [activePanel, setActivePanel] = useState<string | null>(null);

        const togglePanel = (name: string) =>
                setActivePanel((current) => (current === name ? null : name));

        const handleSearch = (value: string) => {
                console.log("Searching for: ", value);
                setSearchValue(value);
        }

        const copyFeatureId = async () => {
                if(!selectedFeature) return;

                try {
                        await
                        navigator.clipboard.writeText(String(selectedFeature.id));
                        console.log("Feature ID copied: ", selectedFeature.id);
                } catch (error) {
                        console.error("Failed to copy feature ID: ", error);
                }
        }

        return (
                <div style={{ display: "flex", flexDirection: "column", width: "100vw", height: "100vh" }}>
                        <header style={{
                                flex: "0 0 auto",
                                height: "46px",
                                background: "linear-gradient(90deg, #0d47a1, #1976d2)",
                                color: "#ffffff",
                                fontWeight: 700,
                                fontSize: "16px",
                                letterSpacing: "0.3px",
                                display: "flex",
                                alignItems: "center",
                                padding: "0 20px",
                                fontFamily: "Arial",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                                zIndex: 20,
                        }}>
                                Saidabad Government Land &amp; Building GIS Viewer
                        </header>
                        <div style={{ position: "relative", flex: "1 1 auto", overflow: "hidden" }}>
                        <MapComponent
                                onFeatureSelect={(feature) => {
                                        setSelectedFeature(feature);
                                        setIdentifyResults([]);
                                        setHoveredFeature(null);
                                }}
                                onMapReady={setMap} 
                                searchValue={searchValue} 
                                onClearSelection={(clearFn) => setClearMapSelection(() => clearFn)}
                                onZoomToFeature={(zoomFn) => setZoomToFeature(() => zoomFn)}
                                onIdentifyResults={setIdentifyResults}
                                hoveredFeature={hoveredFeature}
                                onSelectFeature={(selectFn) => 
                                        setSelectMapFeature(() => selectFn)
                                }
                        />
                        {identifyResults.length > 1 && (
                                <IdentifyResults 
                                        results={identifyResults}
                                        onSelect={(feature) =>{
                                                selectMapFeature?.(feature);
                                                setIdentifyResults([]);
                                                setHoveredFeature(null);
                                        }}
                                        onHover={(feature) => {
                                                setHoveredFeature(feature);
                                        }}
                                        onHoverEnd={() => {
                                                setHoveredFeature(null);
                                        }}
                                        onClose={() => {
                                                setIdentifyResults([]);
                                                setHoveredFeature(null);
                                        }}
                                />
                        )}
                        {selectedFeature && (
                                <FeatureInfo feature={selectedFeature} onClose={
                                        () => {
                                                clearMapSelection?.();
                                                setSelectedFeature(null);
                                        }
                                        } onZoomToFeature={() => {
                                                zoomToFeature?.();
                                        }} onCopyfeatureId={copyFeatureId}
                                        />)
                        }
                        <Search onSearch={handleSearch} />
                        <LayerControl map={map} open={activePanel === "layers"} onToggle={() => togglePanel("layers")} />
                        <BasemapControl map={map} open={activePanel === "basemap"} onToggle={() => togglePanel("basemap")} />
                        <FilterControl map={map} open={activePanel === "filter"} onToggle={() => togglePanel("filter")} />
                        <LegendControl map={map} open={activePanel === "legend"} onToggle={() => togglePanel("legend")} />
                        <AnalysisControl map={map} selectedFeature={selectedFeature} open={activePanel === "analysis"} onToggle={() => togglePanel("analysis")} />
                        </div>
                </div>
        )
}

export default App;