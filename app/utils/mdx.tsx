import parseFrontMatter from "front-matter";
import { parseJSON, formatISO } from "date-fns";
import { fs } from "./fs-extra.server";
import glob from "fast-glob";

import path from "path";
import { bundleMDX } from "./mdx.server";
import haskell from "highlight.js/lib/languages/haskell";
import { fsp, resolve, join } from "./fs.server";

export type Mdx = {
  slug: string;
  date: string;
  title: string;
};

export type MdxMarkdownAttributes = {
  title: string;
};

const archivePath = `${__dirname}/../public/archive`;

export async function getPost(slug: string) {
  // const fg = require("fast-glob");
  // const slugs = await fg(`${archivePath}/${slug}.md`);
  // const slugs = fg.stream(`**/*${slug}*`, { cwd: archivePath });
  // const slugs = await fg(`**/*${slug}*`, { cwd: archivePath });
  // console.log(slugs);
  // if (slugs.length !== 0) {
  //   console.log(slugs);

  //   const file = slugs[0];
  //   const source = await fsp.readFile(file, "utf8");
  // } else {
  //   throw new Response("Not found", { status: 404 });
  // }

  const stream = glob.stream("**/*.md", { cwd: archivePath });

  for await (const entry of stream) {
    console.log(entry);
  }

  const staticDocs = glob
    .sync(join(archivePath, "**/*{slug}.md"))
    .map((path) => ({
      path,
      slug: path.replace(archivePath, "").replace(".md", ""),
    }));
  console.log(staticDocs);
  // const staticDocs = glob.sync(join(archivePath, "**/*.md")).map((path) => {
  //   const pairs = parse(path).name.split(".");
  //   return {
  //     name: formatName(pairs[0], pairs[1] || defaultLang),
  //     path,
  //   };
  // });

  const source = await fsp.readFile(
    path.join(`${archivePath}`, slug + ".md"),
    "utf-8"
  );
  const rehypeHighlight = await import("rehype-highlight").then(
    (mod) => mod.default
  );
  const { default: remarkGfm } = await import("remark-gfm");
  const { default: rehypeAutolinkHeadings } = await import(
    "rehype-autolink-headings"
  );

  const { default: rehypeToc } = await import("rehype-toc");
  const { default: rehypeSlug } = await import("rehype-slug");

  const post = await bundleMDX({
    source,
    xdmOptions(options, frontmatter) {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        // remarkMdxImages,
        remarkGfm,
        // remarkBreaks,
        // [remarkFootnotes, { inlineNotes: true }],
      ];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeAutolinkHeadings,
        rehypeSlug,
        rehypeToc,
        [
          rehypeHighlight,
          { format: "detect", ignoreMissing: true, languages: { haskell } },
        ],
      ];

      return options;
    },
  }).catch((e) => {
    console.error(e);
    throw e;
  });

  return post;
}

export async function getPosts() {
  const postsPath = await fsp.readdir(`${archivePath}`, {
    withFileTypes: true,
  });

  const posts = await Promise.all(
    postsPath.map(async (dirent) => {
      const file = await fsp.readFile(path.join(`${archivePath}`, dirent.name));
      const { attributes } = parseFrontMatter(file.toString());
      console.log(attributes);
      return {
        slug: dirent.name.replace(/\.md/, ""),
        // date: dirent.name.replace(/\.md/, "").slice(0, 10).split("-"), // 2019-11-07-hello-world.md
        date: parseJSON(
          formatISO(
            new Date(dirent.name.replace(/\.md/, "").slice(0, 10).split("-"))
          )
        ),
        //@ts-ignore
        title: attributes.title,
      };
    })
  );
  // console.log(
  //   posts.sort((objA, objB) => objB.date.getTime() - objA.date.getTime())
  // );
  console.log(
    groupByYear(
      posts.sort((objA, objB) => objB.date.getTime() - objA.date.getTime())
    )
  );

  return posts.sort((objA, objB) => objB.date.getTime() - objA.date.getTime());
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
