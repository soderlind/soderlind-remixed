import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import ContentList from "~/components/ContentList";
import ContentListItem from "~/components/ContentListItem";
import { getPosts } from "~/models/post.server";
import { cache, DAY_IN_SECONDS } from "~/utils/cache.server";

export async function loader() {
  if (cache.has("Posts")) {
    return json(cache.get("Posts"));
  }
  const posts = await getPosts();
  cache.set("Posts", posts, DAY_IN_SECONDS);
  return json(posts);
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  if (!data) {
    return null;
  }
  const entries = data; // as Post[];
  const years = Object.keys(entries) as string[];
  const sortedYears = years.sort((a, b) => b.localeCompare(a));

  const postsByYear = sortedYears.map((year) => {
    const y = parseInt(year, 10);
    const posts = entries[y] as unknown as any[];
    const linksByYear = posts.map((post) => (
      <ContentListItem
        key={post.slug}
        post={post}
        date={post.date}
        prefetch="intent"
      />
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

  return <ContentList title="Posts" description="" list={postsByYear} />;
}
