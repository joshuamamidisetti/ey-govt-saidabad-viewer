# Saidabad Government Land & Building GIS Viewer

An interactive web GIS application for **Saidabad ward (Ward 24, Malakpet Circle, South Zone), GHMC, Hyderabad** — built to visualise and analyse government land/buildings and slum areas.

> ⚠️ **Data note:** Geometry is real (building footprints and roads from OpenStreetMap; ward boundary from GHMC). **All attributes are synthetic/dummy data** generated for this assignment and are clearly labelled via a `data_source` field on every feature.

Access live web viewer at https://joshuamamidisetti.github.io/ey-govt-saidabad-viewer/

## Features

- **Layers** — government buildings, slum areas, roads, and ward boundary, each toggleable
- **Interactive pop-ups** — click any feature to see its full attributes
- **Search** — find a building, road, or slum by name/ID (with autocomplete)
- **Attribute filter** — filter buildings by ownership, utilisation, or development status (with a live match count)
- **Colour-coding + legend** — colour buildings by ownership / utilisation / development status
- **Accessibility analysis** — click a site to draw a 300 m buffer and measure nearby roads, government buildings, vacant/underused land, and slums
- **Basemap switching, locate, zoom-to-feature, copy ID**

## Data layers

| Layer | Geometry | Key attributes |
|-------|----------|----------------|
| Government buildings | Polygon | ownership, agency, occupancy, utilisation, development status, encroachment, verification, + inspection records |
| Slum areas | Polygon | population, households, land status, notified status, water/sanitation/electricity/road/drainage |
| Roads | Line | category, surface, lanes, condition, maintained-by |
| Ward boundary | Polygon | ward, circle, zone, area |

## Tech stack

React · TypeScript · MapLibre GL JS · Turf.js · Vite · GeoJSON

## Getting started

```bash
npm install
npm run dev
```

Then open the local URL shown (default `http://localhost:5173`).

To build for production:

```bash
npm run build
```

## Data sources

- **Buildings & roads:** OpenStreetMap (© OpenStreetMap contributors, ODbL)
- **Ward boundary:** GHMC administrative ward boundary
- **All feature attributes and slum polygons:** synthetic/dummy, generated for demonstration only
