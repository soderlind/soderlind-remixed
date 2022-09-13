// import styles from "highlight.js/styles/night-owl.css";
// import { Outlet } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node"; // or cloudflare/deno
import { redirect, json } from "@remix-run/node"; // or cloudflare/deno

import { Link, useLoaderData } from "@remix-run/react";

import { getArchive } from "~/utils/archive";
import type { Mdx } from "~/utils/archive";
import { IntlDate } from "~/components/IntlDate";
import { parseJSON } from "date-fns";

type LoaderData = {
  entries: Awaited<ReturnType<typeof getArchive>>;
};

export const loader = async () => {
  return json<LoaderData>({ entries: await getArchive() });
};

export default function Index() {
  const data = useLoaderData() as LoaderData;
  const entries = data.entries; // as Post[];
  const years = Object.keys(entries) as string[];
  const sortedYears = years.sort((a, b) => b.localeCompare(a));

  const postsByYear = sortedYears.map((year) => {
    const y = parseInt(year, 10);
    const posts = entries[y] as unknown as any[];
    const linksByYear = posts.map((post: Post) => (
      <li key={post.slug} className="post-preview" id={"post-" + post.slug}>
        {/* <Link to={"/archive/" + post.slug} className=""> */}
        <Link to={post.slug} className="">
          <h2 className="title">
            <span>{post.title}</span>
          </h2>

          <IntlDate date={parseJSON(post.date)} timeZone="CET" />
        </Link>
      </li>
    ));
    return (
      <li key={year}>
        <h3 className="list-title">
          <Link to="#" className="">
            {year}
          </Link>
        </h3>
        <ul>{linksByYear}</ul>
      </li>
    );
  });

  const sticky = '<div className="sticky-arrow"></div>';
  return (
    <div className="section-inner">
      <header className="page-header">
        <h4 className="page-subtitle">Archive</h4>
        <div className="page-description">
          These pages are imported from my jekyll blog. Note, a lot of the
          content is outdated.
        </div>
      </header>
      <div className="posts" id="posts">
        <ul>{postsByYear}</ul>
      </div>
    </div>
  );
}
