import type { BaseMapId } from '@/modules/map/model/types';

export interface BaseMapOption {
  id: BaseMapId;
  label: string;
  url: string;
  attribution: string;
}

export const BASE_MAPS: BaseMapOption[] = [
  {
    id: 'osm',
    label: 'Основная',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
  },
  {
    id: 'cartoLight',
    label: 'Серая',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
  },
  {
    id: 'cartoDark',
    label: 'Тёмная',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
  },
  {
    id: 'topo',
    label: 'Рельеф',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors, SRTM | OpenTopoMap',
  },
  {
    id: 'satellite',
    label: 'Спутник',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
  },
];

export const getBaseMapById = (id: BaseMapId) =>
  BASE_MAPS.find((item) => item.id === id) ?? BASE_MAPS[0];
