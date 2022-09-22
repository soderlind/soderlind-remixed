import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getPosts, Post } from "~/models/post.server";
import ContentListItem from "~/components/ContentListItem";
import { sortBy } from "sort-by-typescript";

export async function loader() {
  return json({ entries: await getPosts() });
}

export default function Posts() {
  const data = useLoaderData<typeof loader>();
  const entries = data.entries as unknown as Post[];
  const years = Object.keys(entries) as string[];
  const sortedYears = years.sort((a, b) => b.localeCompare(a));

  return sortedYears.map((year) => {
    const y = parseInt(year, 10);
    const posts = entries[y] as unknown as any[];

    const linksByYear = posts
      .sort(sortBy("-updatedAt"))
      .map((post: Post) => (
        <ContentListItem
          key={post.slug}
          post={post}
          date={post.updatedAt}
          urlPrefix="/posts/"
          prefetch="intent"
        />
      ));
    return (
      <li key={"post-" + year}>
        <h3 className="list-title">
          <Link to="#" className="" key={"link-" + year}>
            {year}
          </Link>
        </h3>
        <ul>{linksByYear}</ul>
      </li>
    );
  });
}
