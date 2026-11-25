import { useEffect, useState } from "react";
import type * as maplibregl from "maplibre-gl";
import { distance } from "@turf/distance";
import saidabad from "../../data/saidabad.json";
import type { IdentifyResult } from "../../types/IdentifyResult";
import { toolContainer, toolButton, toolFlyout } from "../toolStyles";

type AnalysisControlProps = {
        map: maplibregl.Map | null;
        selectedFeature: IdentifyResult | null;
        open: boolean;
        onToggle: () => void;
};

const RADIUS_M = 300;

// Pre-compute a centre point for every feature once (average of its coordinates).
function centroid(geometry: any): [number, number] {
        let sx = 0, sy = 0, n = 0;
        const walk = (c: any) => {
                if (typeof c[0] === "number") { sx += c[0]; sy += c[1]; n++; }
                else c.forEach(walk);
        };
        walk(geometry.coordinates);
        return [sx / n, sy / n];
}

const centres = (saidabad as any).features.map((f: any) => ({
        kind: f.properties.layer_kind,
        props: f.properties,
        centre: centroid(f.geometry),
}));

// Build a circle polygon (manual, no extra library) around a centre point.
function circle(centre: [number, number], radiusM: number, n = 64) {
        const [lng, lat] = centre;
        const latRad = lat * Math.PI / 180;
        const coords: number[][] = [];
        for (let i = 0; i <= n; i++) {
                const ang = (i / n) * 2 * Math.PI;
                const dx = Math.cos(ang) * radiusM / (111320 * Math.cos(latRad));
                const dy = Math.sin(ang) * radiusM / 110540;
                coords.push([lng + dx, lat + dy]);
        }
        return { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [coords] } };
}

type Metrics = {
        nearestRoad: number;
        buildingsNear: number;
        govtNear: number;
        vacantGovtNear: number;
        slumsNear: number;
        nearestSlum: number;
};

function analyse(selfFid: string): Metrics | null {
        const self = centres.find((c: any) => c.props.fid === selfFid);
        if (!self) return null;

        let nearestRoad = Infinity, buildingsNear = 0, govtNear = 0,
                vacantGovtNear = 0, slumsNear = 0, nearestSlum = Infinity;

        for (const c of centres) {
                if (c.props.fid === selfFid) continue;
                const d = distance(self.centre, c.centre, { units: "meters" });

                if (c.kind === "road") {
                        if (d < nearestRoad) nearestRoad = d;
                } else if (c.kind === "building" && d <= RADIUS_M) {
                        buildingsNear++;
                        if (c.props.ownership === "Government") {
                                govtNear++;
                                if (c.props.utilisation === "Unused" || c.props.utilisation === "Underutilised") vacantGovtNear++;
                        }
                } else if (c.kind === "slum") {
                        if (d < nearestSlum) nearestSlum = d;
                        if (d <= RADIUS_M) slumsNear++;
                }
        }
        return { nearestRoad, buildingsNear, govtNear, vacantGovtNear, slumsNear, nearestSlum };
}

function AnalysisControl({ map, selectedFeature, open, onToggle }: AnalysisControlProps) {

        const [metrics, setMetrics] = useState<Metrics | null>(null);

        useEffect(() => {
                if (!map) return;
                const src = map.getSource("analysis-buffer") as any;

                const fid = selectedFeature?.properties?.fid as string | undefined;
                const self = fid ? centres.find((c: any) => c.props.fid === fid) : null;

                if (open && self) {
                        src?.setData(circle(self.centre, RADIUS_M));
                        setMetrics(analyse(fid as string));
                } else {
                        src?.setData({ type: "FeatureCollection", features: [] });
                        setMetrics(null);
                }
        }, [map, selectedFeature, open]);

        const row = (label: string, value: string) => (
                <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", marginTop: "6px", fontSize: "12px" }}>
                        <span style={{ color: "#555" }}>{label}</span>
                        <strong style={{ color: "#222" }}>{value}</strong>
                </div>
        );

        return (
                <div style={toolContainer(170)}>
                        <button style={toolButton(open)} onClick={onToggle}>Analysis</button>
                        {open && (
                                <div style={toolFlyout}>
                                        <strong>Accessibility (within {RADIUS_M} m)</strong>
                                        {!metrics ? (
                                                <div style={{ marginTop: "8px", fontSize: "12px", color: "#555" }}>
                                                        Click a building or slum on the map to assess its surroundings.
                                                </div>
                                        ) : (
                                                <>
                                                        {row("Nearest road", `${Math.round(metrics.nearestRoad)} m`)}
                                                        {row("Buildings nearby", String(metrics.buildingsNear))}
                                                        {row("Govt buildings", String(metrics.govtNear))}
                                                        {row("Vacant / underused govt", String(metrics.vacantGovtNear))}
                                                        {row("Slum areas nearby", String(metrics.slumsNear))}
                                                        {row("Nearest slum", metrics.nearestSlum === Infinity ? "—" : `${Math.round(metrics.nearestSlum)} m`)}
                                                </>
                                        )}
                                </div>
                        )}
                </div>
        );
}

export default AnalysisControl;
