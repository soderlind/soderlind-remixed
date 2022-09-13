import { json } from "@remix-run/node";
import { Link, NavLink, useLoaderData } from "@remix-run/react";
import { parseJSON } from "date-fns";
import { getPosts, Post } from "~/models/post.server";
import { IntlDate } from "~/components/IntlDate";

type LoaderData = {
  entries: Awaited<ReturnType<typeof getPosts>>;
};

export const loader = async () => {
  return json<LoaderData>({ entries: await getPosts() });
};

export default function Posts() {
  const data = useLoaderData() as LoaderData;

  const entries = data.entries as Post[];
  const years = Object.keys(entries) as string[];
  const sortedYears = years.sort((a, b) => b.localeCompare(a));
  const sticky = '<div className="sticky-arrow"></div>';

  return sortedYears.map((year) => {
    const y = parseInt(year, 10);
    const posts = entries[y] as unknown as any[];
    const linksByYear = posts.map((post: Post) => (
      <li
        key={"post-" + post.slug}
        className="post-preview"
        id={"post-" + post.slug}
      >
        <Link
          to={"/posts/" + post.slug}
          className=""
          prefetch="intent"
          key={"link-" + post.slug}
        >
          <h2 className="title">
            <span>{post.title}</span>
          </h2>

          <IntlDate date={parseJSON(post.updatedAt)} timeZone="CET" />
        </Link>
      </li>
    ));
    return (
      <ul>
        <li key={year}>
          <h3 className="list-title">
            <Link to="#" className="" key={year}>
              {year}
            </Link>
          </h3>
          <ul>{linksByYear}</ul>
        </li>
      </ul>
    );
  });
}
