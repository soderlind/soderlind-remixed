import { marked } from "marked";
import type { LoaderFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { parseJSON } from "date-fns";
import { IntlDate } from "~/helpers/IntlDate";
import { getPost } from "~/models/post.server";
type Post = {
  slug: string;
  title: string;
  updatedAt: string;
};
type LoaderData = { post: Post; html: string };

// export const loader: LoaderFunction = async ({ params }) => {
//   invariant(params.slug, `params.slug is required`);
//   const post = await getPost(params.slug);
//   const html = marked(post.markdown);
//   return json<LoaderData>({ post, html });
// };

export default function About() {
  // const { post, html } = useLoaderData() as LoaderData;
  return (
    <article className="post">
      <div className="featured-image"></div>
      <header className="entry-header section-inner">
        <h1 className="entry-title">Per Søderlind</h1>
        <p className="excerpt">TODO: excerpt excerpt excerpt excerpt </p>
      </header>
      <div className="entry-content section-inner">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maxime eum
        pariatur odit similique enim recusandae, impedit quo expedita commodi
        eaque cupiditate beatae eligendi ipsa debitis mollitia asperiores iste
        minus ducimus.
      </div>
    </article>
  );
}
