/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TMA_URL: string // dev local start
  readonly VITE_GLITCHTIP_DSN: string
  readonly VITE_MAPBOX_TOKEN: string
  readonly VITE_POINT_API_FQDN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
