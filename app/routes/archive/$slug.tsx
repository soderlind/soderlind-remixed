import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";

import { parseJSON, formatISO } from "date-fns";
import invariant from "tiny-invariant";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import styles from "highlight.js/styles/night-owl.css";

import { getArchiveContent } from "~/models/jekyll.server";
import type { Jekyll } from "~/models/jekyll.server";
import { FormatDate } from "~/components/FormatDate";

export async function loader({ params }: LoaderArgs) {
  invariant(params.slug, `params.slug is required`);
  const source = (await getArchiveContent(params.slug as string)) as Jekyll;

  if (!source) {
    throw new Response("Not found", { status: 404 });
  }
  const { title, content, slug } = source;
  return { title, content, slug };
}

export const links = () => {
  return [
    {
      rel: "stylesheet",
      href: styles,
    },
  ];
};

export default function ArchiveContent() {
  const { title, content, slug } = useLoaderData<typeof loader>();

  const dstr = getDateFromFilename(slug);
  const strDate = parseJSON(formatISO(new Date(dstr)));
  return (
    <>
      <article className="post">
        <div className="featured-image"></div>
        <header className="entry-header section-inner">
          <h2 className="entry-title">{title}</h2>

          <div className="meta">
            Updated: <FormatDate date={strDate} pattern="d.M.yyyy" />
          </div>
        </header>

        <div className="entry-content section-inner">
          <ReactMarkdown
            children={content}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
          />
          <div className="post-nav">
            <Link className="meta" to="/archive/">
              ← Archive index
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}

function getDateFromFilename(filename: string): string {
  const strDate = filename
    .replace(/\[.md|\.html]/, "") // remove .md or .html
    .slice(0, 10) // get the date part
    .split("-") // split into array
    .map((s) => s.replace(/^0+/, "")) // remove leading zeros
    .join("-"); // join back into string
  return strDate;
}
