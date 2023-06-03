import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";

import { parseJSON, formatISO } from "date-fns";
import { z } from "zod";
import { zx } from "zodix";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import styles from "highlight.js/styles/night-owl.css";

import { getArchiveContent } from "~/services/jekyll.server";
import type { Jekyll } from "~/services/jekyll.server";
import { FormatDate } from "~/components/FormatDate";

export async function loader({ params }: LoaderArgs) {
  let { slug } = zx.parseParams(params, {
    slug: z.string(),
  });

  const source = (await getArchiveContent(slug)) as Jekyll;
  if (!source) {
    throw new Response("Not found", { status: 404, statusText: "Not found" });
  }
  return { source };
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
  const { source } = useLoaderData<typeof loader>();
  const { title, content, slug } = source;

  const dstr = getDateFromFilename(slug);
  const strDate = parseJSON(formatISO(new Date(dstr)));
  return (
    <article className="post">
      <div className="featured-image" />
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
  );
}

function getDateFromFilename(filename: string): string {
  return filename
    .replace(/\[.md|\.html]/, "") // remove .md or .html
    .slice(0, 10) // get the date part
    .split("-") // split into array
    .map((s) => s.replace(/^0+/, "")) // remove leading zeros
    .join("-");
}
