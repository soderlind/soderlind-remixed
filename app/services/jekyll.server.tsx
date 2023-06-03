import path from "path";
import { promises as fsp } from "fs";
import type { FrontMatterOptions, FrontMatterResult } from "front-matter";
import parseFrontMatter from "front-matter";
import { parseJSON, formatISO } from "date-fns";

import { sortBy } from "sort-by-typescript";
import { findByName, FindFirstFile } from "~/services/fs.server";
import { groupByYear } from "~/lib/utils";

export type Jekyll = {
  slug: string;
  date: string;
  title: string;
  content: string;
};

const archivePath = path.resolve("app/jekyll");

export async function getArchiveContent(slug: string) {
  if (!slug) {
    throw new Error("slug is required");
  }

  const file = await FindFirstFile(archivePath, slug);
  if (file) {
    const source = await fsp.readFile(
      path.join(`${archivePath}`, file),
      "utf-8"
    );

    const { attributes, body } = parseFrontMatter<FrontMatterOptions>(source);
    return {
      ...attributes,
      content: body,
      slug: file.replace(/\.[^/.]+$/, ""), // remove extension.
    };
  }
  throw new Response("Not Found", {
    status: 404,
    statusText: "Not Found",
  });
}

export async function getArchive(): Promise<Jekyll[]> {
  const postsPath = await fsp.readdir(`${archivePath}`, {
    withFileTypes: true,
  });

  const posts = await Promise.all(
    postsPath.map(async (dirent) => {
      const file = await fsp.readFile(path.join(`${archivePath}`, dirent.name));
      const { attributes } = parseFrontMatter(
        file.toString()
      ) as FrontMatterResult<Jekyll>;
      const title = attributes.title as string;
      const filename = dirent.name as string;
      const dstr = getDateFromFilename(filename);
      return {
        slug: `/archive/${dirent.name.replace(/\.md|\.html/, "").slice(11)}`,
        date: parseJSON(formatISO(new Date(dstr))),
        title,
      };
    })
  );
  const sortedPosts = posts.sort(sortBy("-date")) as unknown as Jekyll[];
  return groupByYear<Jekyll[]>(sortedPosts, "date");
}

function getDateFromFilename(filename: string): string {
  return filename
    .slice(0, 10) // get the date part
    .split("-") // split into array
    .map((s) => s.replace(/^0+/, "")) // remove leading zeros
    .join("-");
}
