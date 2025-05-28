/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_TMA_URL: string // v2dev or wallet
	readonly VITE_GLITCHTIP_DSN: string
	readonly VITE_MAPBOX_TOKEN: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}

declare const __APP_VERSION__: string
declare const __COMMIT_HASH__: string
