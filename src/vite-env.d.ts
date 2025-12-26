/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_SAVE_DATA_URL: string
  readonly VITE_GET_USER_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
