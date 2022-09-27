import { json } from "@remix-run/node";
import { parseJSON } from "date-fns";
import groq from "groq";
import { sortBy } from "sort-by-typescript";
import { client } from "~/sanity/client";

type Post = {
  title: string;
  slug: string;
  updatedAt: string;
  markdown: string;
};
type Posts = {
  [key: string]: Post[];
};
export type { Post, Posts };

export async function getPosts(): Promise<Posts> {
  const pageList = await client.fetch(
    groq`*[_type == "page"]{ _id, title, slug, _updatedAt }`
  );

  const pages = pageList.map((page) => ({
    title: page.title,
    slug: page.slug.current,
    date: parseJSON(page._updatedAt),
  }));

  return groupByYear(pages.sort(sortBy("-date")));
}

export async function getPost(slug: string) {
  const page = await client.fetch(
    groq`*[_type == "page" && slug.current == $slug][0]{ title, ingress, content, _updatedAt }`,
    { slug }
  );
  if (!page) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  return page;
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
