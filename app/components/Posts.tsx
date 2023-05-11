import { Link } from "@remix-run/react";
import ContentList from "./ContentList";
import ContentListItem from "./ContentListItem";
// import type { Posts } from "~/services/post.server";

export function Posts({ posts }) {
  const years = Object.keys(posts) as string[];
  const sortedYears = years.sort((a, b) => b.localeCompare(a));

  const postsByYear = sortedYears.map((year) => {
    const y = parseInt(year, 10);
    const postsList = posts[y]; // as unknown as any[];
    const linksByYear = postsList.map((post) => (
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
