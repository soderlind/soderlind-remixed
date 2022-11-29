import { codeInput } from "@sanity/code-input";
import { createConfig } from "sanity";
import { deskTool } from "sanity/desk";
import textStats from "./plugins/textStats";
import schema from "./schema";

export const projectDetails = () => ({
  projectId:
    typeof document === "undefined"
      ? process.env.SANITY_PROJECT_ID
      : window?.ENV?.projectId, // ?? import.meta.env.SANITY_PROJECT_ID,
  dataset:
    typeof document === "undefined"
      ? process.env.SANITY_DATASET
      : window?.ENV?.dataset, // ?? import.meta.env.SANITY_DATASET,
  apiVersion:
    typeof document === "undefined"
      ? process.env.SANITY_API_VERSION
      : window?.ENV?.apiVersion, // ?? import.meta.env.SANITY_API_VERSION,
});

export const config = createConfig({
  ...projectDetails(),
  plugins: [deskTool(), codeInput(), textStats()],
  basePath: `/studio`,
  schema: {
    types: schema,
  },
});
