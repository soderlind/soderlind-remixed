// import styles from "highlight.js/styles/nnfx-light.css";
import styles from "highlight.js/styles/night-owl.css";
import { json, LoaderArgs, LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getArchiveContent } from "~/utils/archive";
import { FormatDate } from "~/components/FormatDate";
import { parseJSON, formatISO } from "date-fns";
import invariant from "tiny-invariant";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypePrism from "rehype-prism";

type LoaderData = {
  title: string;
  content: string;
  slug: string;
};

// export const loader: LoaderFunction = async ({ params }) => {
export async function loader(args: LoaderArgs) {
  const { params } = args;
  invariant(params.slug, `params.slug is required`);
  const source = await getArchiveContent(params.slug);

  if (!source) {
    throw new Response("Not found", { status: 404 });
  }
  const { title, content, slug } = source;
  return json<LoaderData>({ title, content, slug });
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
            <FormatDate date={date} timeZone="CET" />
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
