/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_TILE_API_URL: string;
  readonly VITE_ORGANIZATION_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_BASE_TILE_URL: string;
  readonly VITE_BASE_TILE_DARK_URL: string;
  readonly VITE_LLM_API_URL: string;
  readonly VITE_LLM_MODEL_NAME: string;
  readonly VITE_USE_MOCKS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
