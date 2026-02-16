const parseBool = (value: string | undefined, fallback = false): boolean => {
  if (value === undefined) return fallback;

  const normalized = value.trim().replace(/^['"]|['"]$/g, '').toLowerCase();
  return ['1', 'true', 'yes', 'on'].includes(normalized);
};

export const env = {
  appName: import.meta.env.VITE_APP_NAME || 'Информационная система "Байкал"',
  apiUrl:
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV ? '/api/v1' : 'https://baikal.ict.nsc.ru/api/v1'),
  tileApiUrl:
    import.meta.env.VITE_TILE_API_URL ||
    'https://baikal.ict.nsc.ru/api/v1/files/satellite_data/download?full_path=',
  llmApiUrl: import.meta.env.VITE_LLM_API_URL || 'http://127.0.0.1:8080/v1/chat/completions',
  llmModelName: import.meta.env.VITE_LLM_MODEL_NAME || 'Llama-3.2-3B.Q2_K',
  organizationUrl: import.meta.env.VITE_ORGANIZATION_URL || 'http://www.ict.nsc.ru/',
  baseTileUrl:
    import.meta.env.VITE_BASE_TILE_URL ||
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  darkBaseTileUrl:
    import.meta.env.VITE_BASE_TILE_DARK_URL ||
    'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  useMocks: parseBool(import.meta.env.VITE_USE_MOCKS, true),
};
