import { prisma } from "~/db.server";
import type { Post } from "@prisma/client";
import { parseJSON } from "date-fns";
export type { Post };

type Posts = Post[];

export async function getPosts() {
  const posts = await prisma.post.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    where: {
      slug: {
        notIn: [""],
      },
    },
  });

  const postsByYear = groupByYear(posts);

  return postsByYear;
}

export async function getPost(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}

export async function createPost(
  post: Pick<Post, "slug" | "title" | "markdown">
) {
  return prisma.post.create({ data: post });
}

function groupByYear(objectArray: Posts) {
  const InitialValue: Posts = {} as Posts;
  return objectArray.reduce<Posts>((acc, obj) => {
    const key = obj["updatedAt"].getFullYear();
    (acc[key] as unknown as any[]) ??= [];
    (acc[key] as unknown as any[]).push(obj);
    return acc;
  }, InitialValue);
}
