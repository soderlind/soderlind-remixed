import { json, LoaderArgs, LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";

import { parseJSON, formatISO } from "date-fns";
import invariant from "tiny-invariant";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import styles from "highlight.js/styles/night-owl.css";

import { getArchiveContent, Jekyll } from "~/models/jekyll.server";
import { FormatDate } from "~/components/FormatDate";

export async function loader({ params }: LoaderArgs) {
  invariant(params.slug, `params.slug is required`);
  const source = await getArchiveContent(params.slug);

  if (!source) {
    throw new Response("Not found", { status: 404 });
  }
  const { title, content, slug } = source;
  return json({ title, content, slug });
}

export const links = () => {
  return [
    {
      rel: "stylesheet",
      href: styles,
    },
  ];
};

type StrDate = {
  year: string;
  month: string;
  day: string;
};

export default function ArchiveContent() {
  const { title, content, slug } = useLoaderData<LoaderData>();

  const strDate = formatISO(
    new Date(
      slug
        .replace(/\[.md|\.html]/, "")
        .slice(0, 10)
        .split("-")
    )
  );
  const date = parseJSON(strDate);
  return (
    <>
      <article className="post">
        <div className="featured-image"></div>
        <header className="entry-header section-inner">
          <h2 className="entry-title">{title}</h2>

          <div className="meta">
            Updated: <FormatDate date={date} pattern="d.M.yyyy" />
          </div>
        </header>

        <div className="entry-content section-inner">
          <ReactMarkdown
            children={content}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
          />
          <div className="post-nav">
            <Link className="meta" to="/archive">
              ← Archive index
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
