import { json, LinksFunction, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import coynoshadows from "~/styles/prism-coy-without-shadows.css";

import { cache, DAY_IN_SECONDS } from "~/services/cache.server";
import { zx } from "zodix";
import { z } from "zod";
import { getPost, getPostQuery, PostType } from "~/services/post.server";
import { getSession } from "~/sessions";
import { Post } from "~/components/Post";
import { PreviewSuspense } from "@sanity/preview-kit";
import { lazy } from "react";
// import PostPreview from "~/components/PostPreview";

const PostPreview = lazy(() => import("../../components/PostPreview"));

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: coynoshadows }];
};

export const loader = async ({ params, request }: LoaderArgs) => {
  const { slug } = zx.parseParams(params, {
    slug: z.string(),
  });
  const cacheKey = `Post-${slug}`;

  const session = await getSession(request.headers.get("Cookie"));
  const preview = session.get("preview");

  if (preview) {
    const query = getPostQuery();
    return {
      preview: true,
      query,
      params,
    };
  }

  //   if (cache.has(cacheKey)) {
  //     const cached = cache.get(cacheKey) as string;
  //     return JSON.parse(cached);
  //   }

  const post = (await getPost(params))[0];
  if (!post) {
    throw new Response("Not found", { status: 404 });
  }
  cache.set(cacheKey, JSON.stringify(post), DAY_IN_SECONDS);
  return json({ post });
};

export default function Product() {
  // const page = useLoaderData<typeof loader>();
  const { preview, query, params, post } = useLoaderData();
  return preview ? (
    <PreviewSuspense fallback="Loading...">
      <PostPreview query={query} params={params} />
    </PreviewSuspense>
  ) : (
    <Post post={post} />
  );
}
