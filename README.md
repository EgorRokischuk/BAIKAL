# Baikal Monitoring (`new_project`)

Modern frontend for Lake Baikal monitoring data visualization and analysis.

## What the platform does

### 1. Ready raster products (satellite/derived)
- Select parameter (`LST`, `Chlorophyll`).
- Select source (`VIIRS`, `Terra`, `Aqua`, `Landsat`, `Sentinel-2` where applicable).
- Select data mode and date:
  - `Landsat` exact date.
  - `Monthly averages` month+year.
  - `Multi-year monthly mean` month.
  - `Chlorophyll` month.
- Render/hide raster layer on map.
- Download source raster link from backend.
- Adjust layer opacity.
- Click map to read point value for raster temperature products.

### 2. Date comparison mode (split-screen)
- Open `Comparison` section in map panel.
- Choose two dates (`Date A`, `Date B`) for the same configured measurement.
- Open split-screen mode with two synchronized maps.
- Pan/zoom any side; both maps stay aligned.
- Close comparison and return to single-map mode.

### 3. Ground data mode
- Choose start/end date.
- Load available parameters and sources from backend.
- Show clustered markers on map.
- Export displayed points to Excel.

### 4. Online products (GEE)
- Point or polygon selection on map.
- Single-date or date-range queries.
- Get point value or resulting geotiff link.

### 5. Content sections
- `Publications`: searchable list and admin CRUD.
- `External Resources`: cards with links and admin CRUD.
- `About`: project records and admin CRUD.
- `Support`: support ticket form with optional file.

### 6. Guide + AI assistant
- Guide page includes a local LLM assistant focused on **how to use this platform**.
- Assistant is intended for product usage консультации, not authoritative scientific conclusions.

## UX/Performance updates in this version
- Reworked map panel into left-side section navigation (`Ready products`, `Comparison`, `Ground data`, `Online GEE`).
- Added route-level lazy loading with skeleton fallback.
- Reduced extra requests in ready-product setup (removed availability probing fan-out for photo-time variants).
- Added RTK Query cache tuning (`keepUnusedDataFor`, disabled focus/reconnect refetch by default).

## Tech stack
- React + TypeScript + Vite
- Redux Toolkit + RTK Query
- MUI
- Leaflet + React Leaflet
- React Hook Form + Zod

## Environment variables
Create `.env` from `.env.example`.

Key vars:
- `VITE_API_URL`
- `VITE_TILE_API_URL`
- `VITE_ORGANIZATION_URL`
- `VITE_LLM_API_URL` (OpenAI-compatible chat endpoint, default `http://127.0.0.1:8080/v1/chat/completions`)
- `VITE_LLM_MODEL_NAME`

## Run app
```bash
npm install
npm run dev
```

## LLM assistant setup (local GGUF)
This project expects your local OpenAI-compatible endpoint (for example `llama-server`) using model file:
- `models/Llama-3.2-3B.Q2_K.gguf`

Example with `llama.cpp` server:
```bash
llama-server -m ./models/Llama-3.2-3B.Q2_K.gguf --host 127.0.0.1 --port 8080 --ctx-size 4096
```

Then ensure:
- `VITE_LLM_API_URL=http://127.0.0.1:8080/v1/chat/completions`
- `VITE_LLM_MODEL_NAME=Llama-3.2-3B.Q2_K`

## Build and lint
```bash
npm run lint
npm run build
```

## Notes
- The LLM assistant provides recommendations and may be incorrect.
- ФИЦ ИВТ does not bear responsibility for model answers.
