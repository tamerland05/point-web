/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TMA_URL: string
  readonly VITE_GLITCHTIP_DSN: string
  readonly VITE_MAPBOX_TOKEN: string
  readonly VITE_POINT_API_FQDN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const __APP_VERSION__: string
declare const __COMMIT_HASH__: string
