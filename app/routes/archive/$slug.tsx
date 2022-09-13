import styles from "highlight.js/styles/default.css";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData, Link, Outlet } from "@remix-run/react";
import { getArchiveContent } from "~/utils/archive";
import { IntlDate } from "~/components/IntlDate";
import { parseJSON, formatISO } from "date-fns";
import invariant from "tiny-invariant";

import { archivePath } from "~/utils/mdx.server";

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
  // console.log(post);
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

export default function Mdx() {
  const { title, body, slug } = useLoaderData<LoaderData>();
  const hljs = require("highlight.js");
  const md = require("markdown-it")({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(str, { language: lang }).value;
        } catch (__) {}
      }

      return ""; // use external default escaping
    },
    // highlight: function (str, lang) {
    //   if (lang && hljs.getLanguage(lang)) {
    //     try {
    //       return (
    //         '<pre class="hljs"><code>' +
    //         hljs.highlight(str, { language: lang, ignoreIllegals: true })
    //           .value +
    //         "</code></pre>"
    //       );
    //     } catch (__) {}
    //   }

    //   return (
    //     '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + "</code></pre>"
    //   );
    // },
  });

  const content = {
    __html: md.render(body),
  };
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
          <h1 className="entry-title">{title}</h1>
          <div className="meta">
            <IntlDate date={date} timeZone="CET" />
          </div>
        </header>
        <div
          className="entry-content section-inner"
          dangerouslySetInnerHTML={content}
        ></div>
      </article>
    </>
  );
}
