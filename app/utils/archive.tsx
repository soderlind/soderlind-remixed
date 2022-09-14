import parseFrontMatter from "front-matter";
import { parseJSON, formatISO } from "date-fns";
import path from "path";

import { fsp, resolve, join } from "./fs.server";

export type Mdx = {
  slug: string;
  date: string;
  title: string;
};

export type MdxMarkdownAttributes = {
  title: string;
  date: string;
};

const archivePath = `${__dirname}/../public/jekyll`;

function handleEmbedderError({ url }: { url: string }) {
  return `<p>Error embedding <a href="${url}">${url}</a>.`;
}

export async function getArchiveContent(params) {
  const paths = require("~/paths.json");

  const pathname = params.slug.replace(/^\/+/, "");

  const regexp = new RegExp(`${pathname}`, "i");
  const pathMatch = paths.find((p) => regexp.test(p.path));

  if (pathMatch) {
    const source = await fsp.readFile(
      path.join(`${archivePath}`, pathMatch.path),
      "utf-8"
    );

    const { attributes, body } = parseFrontMatter(source);
    const pathFunc = require("path");
    const extension = pathFunc.extname(pathMatch.path).replace(".", "");
    return {
      ...attributes,
      body: body,
      slug: pathMatch.path,
      type: extension,
    };
  } else {
    return null;
  }
}

export async function getArchive() {
  const postsPath = await fsp.readdir(`${archivePath}`, {
    withFileTypes: true,
  });

  const posts = await Promise.all(
    postsPath.map(async (dirent) => {
      const file = await fsp.readFile(path.join(`${archivePath}`, dirent.name));
      const { attributes, body } = parseFrontMatter(file.toString());

      return {
        slug: "/archive/" + dirent.name.replace(/\.md|\.html/, "").slice(11),
        date: parseJSON(
          formatISO(
            new Date(
              dirent.name
                .replace(/\[.md|\.html]/, "")
                .slice(0, 10)
                .split("-")
            )
          )
        ),
        //@ts-ignore
        title: attributes.title,
        type: dirent.name.split("/").pop(),
      };
    })
  );

  return groupByYear(
    posts.sort((objA, objB) => objB.date.getTime() - objA.date.getTime())
  );
}

function groupByYear(objectArray: Mdx) {
  const InitialValue: Mdx[] = {} as Mdx[];
  return objectArray.reduce<Mdx>((acc, obj) => {
    const key = parseJSON(obj["date"]).getFullYear();
    (acc[key] as unknown as any[]) ??= [];
    (acc[key] as unknown as any[]).push(obj);
    return acc;
  }, InitialValue);
}