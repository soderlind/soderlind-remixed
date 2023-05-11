import { createClient } from "@sanity/client";
import { definePreview } from "@sanity/preview-kit";

// copy these from your Studio's sanity.config.ts
export const projectId = "qh5dilp9";
export const dataset = "production";
export const apiVersion = "2023-01-01";
export const useCdn = true;

export const client = createClient({ projectId, dataset, apiVersion, useCdn });

function onPublicAccessOnly() {
  throw new Error(`Unable to load preview as you're not logged in`);
}

export const usePreview = definePreview({
  projectId,
  dataset,
  onPublicAccessOnly,
});
