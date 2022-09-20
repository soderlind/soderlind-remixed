import { marked } from "marked";
import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { parseJSON } from "date-fns";
import { IntlDate } from "~/components/IntlDate";
import { getPost } from "~/models/post.server";

type Post = {
  slug: string;
  title: string;
  markdown: string;
  updatedAt: string;
};
type LoaderData = { post: Post; html: string };

// export const loader: LoaderFunction = async ({ params }) => {
export async function loader(args: LoaderArgs) {
  const { params } = args;
  invariant(params.slug, `params.slug is required`);
  const post = await getPost(params.slug);
  const html = marked(post.markdown);
  return json({ post, html });
}

export default function PostSlug() {
  const { post, html } = useLoaderData<LoaderData>();
  return (
    <article className="post">
      <div className="featured-image"></div>
      <header className="entry-header section-inner">
        <h1 className="entry-title">{post.title}</h1>
        <p className="excerpt">TODO: excerpt excerpt excerpt excerpt </p>
        <div className="meta">
          <a href="#">
            <IntlDate date={parseJSON(post.updatedAt)} timeZone="UTC" />
          </a>
        </div>
      </header>
      <div className="entry-content section-inner">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </article>
  );
}
