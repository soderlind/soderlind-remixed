import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { parseJSON } from "date-fns";

import coynoshadows from "~/styles/prism-coy-without-shadows.css";

import SanityContent from "~/components/SanityContent";
import { getPost, getToc } from "~/services/post.server";
import { cache, DAY_IN_SECONDS } from "~/utils/cache.server";
import { FormatDate } from "~/components/FormatDate";
import { zx } from "zodix";
import { z } from "zod";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: coynoshadows }];
};

export const loader = async ({ params }: LoaderArgs) => {
  const { slug } = zx.parseParams(params, {
    slug: z.string(),
  });
  const cacheKey = `Post-${slug}`;
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey) as string;
    return JSON.parse(cached);
  }
  const post = await getPost(slug);
  if (!post) {
    throw new Response("Not found", { status: 404 });
  }
  cache.set(cacheKey, JSON.stringify(post), DAY_IN_SECONDS);
  return post;
};

export default function Product() {
  const page = useLoaderData<typeof loader>();
  const date = parseJSON(page._updatedAt);
  return (
    <article className="post">
      <div className="featured-image" />
      <header className="entry-header section-inner">
        {page?.title ? <h2 className="entry-title">{page.title}</h2> : null}
        {page?.ingress ? <p className="excerpt">{page.ingress} </p> : null}
        <div className="meta">
          Updated: <FormatDate date={date} pattern="d.M.yyyy" />
        </div>
      </header>
      <div className="entry-content section-inner">
        {page?.content && page.content?.length > 0 ? (
          <SanityContent value={page.content} />
        ) : null}
        <div className="post-nav">
          <Link className="meta" to="/posts/">
            ← Posts index
          </Link>
        </div>
      </div>
    </article>
  );
}
