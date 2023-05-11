import { SanityDocument, SanityDocumentStub } from "@sanity/client";
import { parseJSON } from "date-fns";
import groq from "groq";
import { sortBy } from "sort-by-typescript";
import { isAborted, z } from "zod";
import { client } from "~/lib/sanity";
import { groupByYear } from "~/lib/utils";

export function getPostsQuery() {
  return `*[_type == "post" && defined(slug.current)]`;
}

export function getPostQuery() {
  return `*[_type == "post" && slug.current == $slug]`;
}

export type PostType = {
  title: string;
  slug: string;
  date: string;
  body: object;
};
export type PostsType = {
  [key: string]: PostType[];
};

export async function getPosts() {
  const postsList: SanityDocument[] = await client.fetch(getPostsQuery());
  const posts = postsList.map((post) => {
    const slug = post.slug as { current: string };
    return slug !== undefined
      ? {
          title: post.title,
          slug: slug.current as string,
          date: parseJSON(post._updatedAt as string) as unknown as string,
        }
      : undefined;
  }) as unknown as PostType[];
  const postsParsed = posts.filter((post) => post !== undefined);
  return groupByYear<PostsType>(
    postsParsed.sort(sortBy("-date")),
    "date"
  ) as PostsType;
}

export async function getPost(params) {
  return (await client.fetch(getPostQuery(), params)) as SanityDocumentStub;
}

export async function getToc(slug: string) {
  return await client.fetch(
    groq`*[_type == "page" && slug.current == $slug]{ "tableOfContents": content[length(style) == 2 && string::startsWith(style, "h")]}`,
    { slug }
  );
}
