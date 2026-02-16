export const typeDictionary: Record<string, string> = {
  baikalRiver: 'Озеро Байкал',
  baikalNature: 'Байкальская природная территория',
  groundData: 'Наземные данные',
};

const satelliteProductTypes = ['baikalRiver', 'baikalNature'] as const;

export const resolveSatelliteDataType = (productType: string): string => {
  const fallback = typeDictionary.baikalRiver;

  if (!productType) return fallback;
  if (!satelliteProductTypes.includes(productType as (typeof satelliteProductTypes)[number])) {
    return fallback;
  }

  return typeDictionary[productType] ?? fallback;
};

export const parameterDictionary: Record<string, string> = {
  temperature: 'LST',
  chlorophyll: 'Хлорофилл',
  transparency: 'Прозрачность',
};

export const deviceDictionary: Record<string, string> = {
  viirs: 'VIIRS',
  terra: 'MODIS Terra',
  aqua: 'MODIS Aqua',
  landsat: 'LANDSAT',
  sentinel: 'SENTINEL-2',
};

export const photoTimeDictionary: Record<string, string> = {
  daily: 'Дневные',
  nightly: 'Ночные',
  diurnal: 'Суточные',
};
