interface ImportMetaEnv {
  readonly SANITY_PROJECT_ID: string;
  readonly SANITY_DATASET: string;
  readonly SANITY_API_VERSION: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
