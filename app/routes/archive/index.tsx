import { json } from "@remix-run/node"; // or cloudflare/deno
import { Link, useLoaderData } from "@remix-run/react";

import { getArchive } from "~/models/jekyll.server";

import ContentList from "~/components/ContentList";
import ContentListItem from "~/components/ContentListItem";

export async function loader() {
  return json({ entries: await getArchive() });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  const entries = data.entries; // as Post[];
  const years = Object.keys(entries) as string[];
  const sortedYears = years.sort((a, b) => b.localeCompare(a));

  const postsByYear = sortedYears.map((year) => {
    const y = parseInt(year, 10);
    const posts = entries[y] as unknown as any[];
    const linksByYear = posts.map((post) => (
      <ContentListItem key={post.slug} post={post} date={post.date} prefetch="intent" />
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
  }) as unknown as string;

  return (
    <ContentList
      title="Archive"
      description="These pages are imported from my jekyll blog. Note, a lot of the content is outdated."
      list={postsByYear}
    />
  );
}
