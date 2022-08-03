import styles from "highlight.js/styles/night-owl.css";
import { getMDXComponent } from "mdx-bundler/client";
import { useMemo } from "react";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { getPost } from "~/utils/mdx";
import { IntlDate } from "~/helpers/IntlDate";
import { parseJSON, formatISO } from "date-fns";
type LoaderData = {
  frontmatter: any;
  code: string;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const slug = params["*"];
  if (!slug) throw new Response("Not found", { status: 404 });

  const post = await getPost(slug);
  if (post) {
    const { frontmatter, code } = post;
    return json({ frontmatter, code });
  } else {
    throw new Response("Not found", { status: 404 });
  }
};

export const links = () => {
  return [
    {
      rel: "stylesheet",
      href: styles,
    },
  ];
};

export default function Post() {
  const { code, frontmatter } = useLoaderData<LoaderData>();
  const Component = useMemo(() => getMDXComponent(code), [code]);
  // const strDate = frontmatter.date;

  // const { year, month, day } = strDate.split("-").map((x) => Number(x));
  // const date = parseJSON(formatISO(new Date(year, month, day)));
  return (
    <>
      <article className="post">
        <div className="featured-image"></div>
        <header className="entry-header section-inner">
          <h1 className="entry-title">{frontmatter.title}</h1>

          <div className="meta">
            <Link to="/archive">← Back to archiv index</Link>
            <a href="#">{/* <IntlDate date={date} timeZone="CET" /> */}</a>
          </div>
        </header>
        <div className="entry-content section-inner">
          <Component />
        </div>
      </article>
    </>
  );
}
