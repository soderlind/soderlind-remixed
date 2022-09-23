import type { Block, SanityDocumentLike } from "sanity";

export type Page = SanityDocumentLike & {
  title?: string;
  slug?: {
    current?: string;
  };
  content?: Block[];
};
