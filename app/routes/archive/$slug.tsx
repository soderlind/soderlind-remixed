import styles from "highlight.js/styles/default.css";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData, Link, Outlet } from "@remix-run/react";
import { getArchiveContent } from "~/utils/archive";
import { IntlDate } from "~/components/IntlDate";
import { parseJSON, formatISO } from "date-fns";
import invariant from "tiny-invariant";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";

type LoaderData = {
  title: string;
  body: string;
  slug: string;
};

export const loader: LoaderFunction = async ({ params }) => {
  // const slug = params["*"];
  invariant(params.slug, `params.slug is required`);

  const source = await getArchiveContent(params);

  if (!source) {
    throw new Response("Not found", { status: 404 });
  }
  console.log(source);
  const { title, body, slug } = source;

  return json<LoaderData>({ title, body, slug });
};

export const links = () => {
  return [
    {
      rel: "stylesheet",
      href: styles,
    },
  ];
};

export default function ArchiveContent() {
  const { title, body, slug } = useLoaderData<LoaderData>();

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
          <Link className="meta" to="/archive">
            ← Back to the archive index
          </Link>
          <h2 className="entry-title">{title}</h2>
          <div className="meta">
            <IntlDate date={date} timeZone="CET" />
          </div>
        </header>
        {/* <div
          className="entry-content section-inner"
          dangerouslySetInnerHTML={content}
        ></div> */}
        <div className="entry-content section-inner">
          <ReactMarkdown
            children={body}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeHighlight]}
          />
        </div>
      </article>
    </>
  );
}
