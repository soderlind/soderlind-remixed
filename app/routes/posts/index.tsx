import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { parseJSON } from "date-fns";
import { sortBy } from "sort-by-typescript";

import groq from "groq";
import { client } from "~/sanity/client";

import ContentList from "~/components/ContentList";
import ContentListItem from "~/components/ContentListItem";
import type { Post } from "~/models/post.server";
import type { Page } from "~/sanity/types/Page";

export const loader: LoaderFunction = async () => {
  const pageList = await client.fetch(
    groq`*[_type == "page"]{ _id, title, slug, _updatedAt }`
  );

  const pages = pageList.map((page) => ({
    title: page.title,
    slug: page.slug.current,
    date: parseJSON(page._updatedAt),
  }));

  return groupByYear(pages.sort(sortBy("-date")));
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  console.log(data);
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

function groupByYear(objectArray: Post) {
  const InitialValue: Post[] = {} as Post[];
  return objectArray.reduce((acc, obj) => {
    const key = parseJSON(obj["date"]).getFullYear();
    (acc[key] as unknown as any[]) ??= [];
    (acc[key] as unknown as any[]).push(obj);
    return acc;
  }, InitialValue);
}
