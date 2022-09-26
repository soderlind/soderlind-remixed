import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import coynoshadows from "~/styles/prism-coy-without-shadows.css";

import SanityContent from "~/components/SanityContent";
import type { Page } from "~/sanity/types/Page";
import { getPost } from "~/models/post.server";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: coynoshadows }];
};

export const loader = async ({ params }: LoaderArgs) => {
  return await getPost(params.slug as string);
};

export default function Product() {
  const { page } = useLoaderData<{ page: Page }>();
  console.log(page);

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
