"use client";

import type { QueryParams } from "@sanity/client";
import { usePreview } from "~/lib/sanity";
import ExitPreview from "~/components/ExitPreview";
import { Post } from "./Post";

export default function PostPreview({
  query,
  params,
}: {
  query: string;
  params: QueryParams;
}) {
  const post = usePreview(null, query, params)[0];
  return (
    <>
      <Post post={post} />
      <ExitPreview />
    </>
  );
}
