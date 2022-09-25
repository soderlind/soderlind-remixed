import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import groq from "groq";
import coy from "~/styles/prism.css";
import vsdark from "~/styles/prism-vsc-dark-plus.css";
import vslight from "~/styles/prism-vs.css";
import coynoshadows from "~/styles/prism-coy-without-shadows.css";

import Layout from "~/components/Layout";

import SanityContent from "~/components/SanityContent";
import { client } from "~/sanity/client";
import type { Page } from "~/sanity/types/Page";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: coynoshadows }];
};

export const loader: LoaderFunction = async ({ params }) => {
  const { slug } = params;
  const page = await client.fetch(
    groq`*[_type == "page" && slug.current == $slug][0]{ title, ingress, content, _updatedAt }`,
    { slug }
  );
  if (!page) {
    return new Response("Not found", { status: 404 });
  }

  return { page };
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
