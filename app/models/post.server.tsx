// import { prisma } from "~/db.server";
// import type { Post } from "@prisma/client";
import { parseJSON } from "date-fns";
import Posts from "~/routes/posts";

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
  // const posts = await prisma.post.findMany({
  //   orderBy: {
  //     updatedAt: "desc",
  //   },
  //   where: {
  //     slug: {
  //       notIn: [""],
  //     },
  //   },
  // });

  const posts = {
    "2020": [
      {
        slug: "2020-01-01",
        title: "Lorem",
        updatedAt: "2020-01-01T00:00:00.000Z",
        markdown: "lorem ipsum dolores est",
      },
      {
        slug: "2020-01-02",
        title: "Ipsum",
        updatedAt: "2020-01-02T00:00:00.000Z",
        markdown: "lorem ipsum dolores est",
      },
      {
        slug: "2020-01-03",
        title: "Dolores",
        updatedAt: "2020-01-03T00:00:00.000Z",
        markdown: "lorem ipsum dolores est",
      },
    ],
    "2021": [
      {
        slug: "2021-01-04",
        title: "Est",
        updatedAt: "2021-01-04T00:00:00.000Z",
        markdown: "lorem ipsum dolores est",
      },
      {
        slug: "2021-01-05",
        title: "2021-01-05",
        updatedAt: "2021-01-05T00:00:00.000Z",
        markdown: "lorem ipsum dolores est",
      },
      {
        slug: "2021-01-06",
        title: "2021-01-06",
        updatedAt: "2021-01-06T00:00:00.000Z",
        markdown: "lorem ipsum dolores est",
      },
      {
        slug: "2021-01-07",
        title: "2021-01-07",
        updatedAt: "2021-01-07T00:00:00.000Z",
        markdown: "lorem ipsum dolores est",
      },
      {
        slug: "2021-01-08",
        title: "2021-01-08",
        updatedAt: "2021-01-08T00:00:00.000Z",
        markdown: "lorem ipsum dolores est",
      },
    ],
  };

  // const postsByYear = groupByYear(posts);

  return posts as Posts;
}

export async function getPost(slug: string) {
  const posts = (await getPosts()) as unknown as any[] as Post[];

  const post = Object.keys(posts).reduce((acc, year) => {
    const y = parseInt(year, 10);
    const yearPosts = posts[y] as unknown as any[];
    const post = yearPosts.find((p: Post) => p.slug === slug);
    if (post) {
      return post;
    }
    return acc;
  }, {} as Posts);

  return post;
}

function groupByYear(objectArray: Posts) {
  const InitialValue: Posts = {} as Posts;
  return objectArray.reduce<Posts>((acc, obj) => {
    const key = parseJSON(obj["updatedAt"]).getFullYear();
    (acc[key] as unknown as any[]) ??= [];
    (acc[key] as unknown as any[]).push(obj);
    return acc;
  }, InitialValue);
}