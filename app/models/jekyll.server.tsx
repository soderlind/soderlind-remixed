import path from "path";
import { promises as fsp } from "fs";
import type {
  FrontMatterOptions,
  FrontMatterResult,
} from "front-matter";
import parseFrontMatter from "front-matter";
import { parseJSON, formatISO } from "date-fns";

import { sortBy } from "sort-by-typescript";
import { findByName } from '~/utils/fs.server';

export type Jekyll = {
  slug: string;
  date: string;
  title: string;
  content: string;
};

const archivePath = path.resolve("public/jekyll");

export async function getArchiveContent(slug: string) {
  if (!slug) {
    throw new Error("slug is required");
  }

	const pathMatch = await findByName(archivePath, slug);

	if (pathMatch && pathMatch.length > 0) {
		const source = await fsp.readFile(
			path.join(`${archivePath}`, pathMatch[0]),
			"utf-8"
		);

    const { attributes, body } = parseFrontMatter<FrontMatterOptions>(source);
    return {
      ...attributes,
      content: body,
      slug: pathMatch[0].replace(/\.[^/.]+$/, ""), // remove extension.
    };
  } else {
    throw new Response("Not Found", {
      status: 404,
    });
  }
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
        slug: "/archive/" + dirent.name.replace(/\.md|\.html/, "").slice(11),
        date: parseJSON(formatISO(new Date(dstr))),
        title: title,
      };
    })
  );
  const sortedPosts = posts.sort(sortBy("-date")) as unknown as Jekyll[];
  return groupByYear<Jekyll[]>(sortedPosts, "date");
}

function getDateFromFilename(filename: string): string {
  const strDate = filename
    // .replace(/\[.md|\.html]/, "") // remove .md or .html
    .slice(0, 10) // get the date part
    .split("-") // split into array
    .map((s) => s.replace(/^0+/, "")) // remove leading zeros
    .join("-"); // join back into string
  return strDate;
}

function groupByYear<Type>(objectArray: Type, property: string) {
  const InitialValue: Type = {} as Type;
  const oArray = objectArray as unknown as any[];
  return oArray.reduce<Type>((acc, obj) => {
    const key = parseJSON(obj[property]).getFullYear() as keyof Type; //as unknown as string;
    (acc[key] as any[]) ??= [];
    (acc[key] as any[]).push(obj);
    return acc;
  }, InitialValue);
}
