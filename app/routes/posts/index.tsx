import { LoaderArgs, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getPosts, getPostsQuery } from "~/services/post.server";
import { cache, DAY_IN_SECONDS } from "~/services/cache.server";
import { getSession } from "~/sessions";
import { lazy } from "react";
import { PreviewSuspense } from "@sanity/preview-kit";
import { Posts } from "~/components/Posts";

const PostsPreview = lazy(() => import("../../components/PostsPreview"));

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  // export async function loader({ request }: LoaderArgs) {
  //   if (cache.has("Posts")) {
  //     return json(cache.get("Posts"));
  //   }

  //   const query = `*[_type == "post" && defined(slug.current)]`;
  const session = await getSession(request.headers.get("Cookie"));
  const preview = session.get("preview");

  // Preview session cookie found, return early and query client-side!
  if (preview) {
    const query = getPostsQuery();
    return { preview: true, query };
  }

  const posts = await getPosts();
  return { preview: false, posts };
};

export default function Index() {
  const { preview, query, posts } = useLoaderData();

  return preview ? (
    <PreviewSuspense fallback="Loading...">
      <PostsPreview query={query} />
    </PreviewSuspense>
  ) : (
    <Posts posts={posts} />
  );
}
