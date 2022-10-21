import { parseJSON } from "date-fns";
import groq from "groq";
import { sortBy } from "sort-by-typescript";
import { z } from "zod";
import { client } from "~/sanity/client";
import type { Page } from "~/sanity/types/Page";

type Post = {
  title: string;
  slug: string;
  updatedAt: string;
  markdown: string;
};
type Posts = {
  [key: string]: Post[];
};

const PostSchema = z.object({
  title: z.string(),
  slug: z.string(),
  updatedAt: z.string(),
  markdown: z.string(),
});

const PostsSchema = z.array(PostSchema);

export type { Post, Posts };

export async function getPosts(): Promise<Posts> {
  const pageList = await client.fetch(
    groq`*[_type == "page"]{ _id, title, slug, _updatedAt }`
  );

  const pages = pageList.map((page: Page) => {
    const slug = page.slug as { current: string };
    return slug !== undefined
      ? {
          title: page.title,
          slug: slug.current as string,
          date: parseJSON(page._updatedAt as string) as unknown as string,
        }
      : undefined;
  });

  const pagesParsed = pages.filter((page) => page !== undefined) as Post[];

  return groupByYear(pagesParsed.sort(sortBy("-date")));
}

export async function getPost(slug: string) {
  return await client.fetch(
    groq`*[_type == "page" && slug.current == $slug][0]{ title, ingress, content, _updatedAt }`,
    { slug }
  );
}

export async function getToc(slug: string) {
  return await client.fetch(
    groq`*[_type == "page" && slug.current == $slug]{ "tableOfContents": content[length(style) == 2 && string::startsWith(style, "h")]}`,
    { slug }
  );
}

function groupByYear(objectArray: any[]) {
  const InitialValue: Post[] = {} as Post[];
  return objectArray.reduce((acc, obj) => {
    const key = parseJSON(obj.date).getFullYear();
    (acc[key] as unknown as any[]) ??= [];
    (acc[key] as unknown as any[]).push(obj);
    return acc;
  }, InitialValue);
}
