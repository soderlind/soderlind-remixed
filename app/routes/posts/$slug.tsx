import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import coynoshadows from "~/styles/prism-coy-without-shadows.css";

import SanityContent from "~/components/SanityContent";
import type { Page } from "~/sanity/types/Page";
import { getPost } from "~/models/post.server";
import { json } from "remix-utils";
import { cache, DAY_IN_SECONDS } from "~/utils/cache.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: coynoshadows }];
};

export const loader = async ({ params }: LoaderArgs) => {
  const slug = params.slug as string;
  const cacheKey = `Post-${slug}`;
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey) as string;
    return JSON.parse(cached);
  }
  const post = await getPost(slug);

  cache.set(cacheKey, JSON.stringify(post), DAY_IN_SECONDS);
  return post;
};

export default function Product() {
  const page = useLoaderData<typeof loader>();

  return (
    <article className="post">
      <div className="featured-image"></div>
      <header className="entry-header section-inner">
        {page?.title ? <h2 className="entry-title">{page.title}</h2> : null}
        {page?.ingress ? <p className="excerpt">{page.ingress} </p> : null}
      </header>
      <div className="entry-content section-inner">
        {page?.content && page.content?.length > 0 ? (
          <SanityContent value={page.content} />
        ) : null}
      </div>
    </article>
  );
}
