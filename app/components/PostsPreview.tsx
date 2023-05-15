import { usePreview } from "~/lib/sanity";
import { Posts } from "./Posts";
import ExitPreview from "./ExitPreview";
import { sortBy } from "sort-by-typescript";
import type { PostsType } from "~/services/post.server";
import { parseJSON } from "date-fns";
import { groupByYear } from "~/lib/utils";

export default function PostsPreview({ query }: { query: string }) {
  const postsList = usePreview(null, query) as any[];

  const posts = postsList.map((post) => {
    const slug = post.slug.current as string;
    return slug !== undefined
      ? {
          title: post.title,
          slug: slug,
          date: parseJSON(post._updatedAt as string) as unknown as string,
        }
      : undefined;
  });
  const postsParsed = posts.filter((post) => post !== undefined);
  const p = groupByYear<PostsType>(postsParsed.sort(sortBy("-date")), "date");
  return (
    <>
      <Posts posts={p} />
      <ExitPreview />
    </>
  );
}
