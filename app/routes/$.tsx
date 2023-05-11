import type { LoaderArgs } from "@remix-run/node"; // or cloudflare/deno
import { redirect } from "@remix-run/node"; // or cloudflare/deno
import { useCatch } from "@remix-run/react";

import { z } from "zod";
import { zx } from "zodix";
import { FindFirstFile } from "~/services/fs.server";

type Path = {
  path: string;
};
type Paths = Path[];
const ignorePaths = ["/about", "/archive", "/post"];

export const loader = async ({ request }: LoaderArgs) => {
  const pathname = new URL(request.url).pathname;
  const path = require("path");
  const archivePath = path.resolve("app/jekyll");

  const basename = path.basename(pathname);
  const dirname = path.dirname(pathname);

  const ignore = ignorePaths.some((oath) => dirname.startsWith(oath));
  if (!ignore) {
    const file = await FindFirstFile(archivePath, basename);
    if (file) {
      const slug = file.replace(/\.[^/.]+$/, ""); // remove extension.
      return redirect(`/archive/${slug}`, 301);
    }
  }

  throw new Response("Not Found", {
    status: 404,
  });
};

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <article className="post">
      <div className="featured-image"></div>
      <header className="entry-header section-inner">
        <h1 className="entry-title">You&#x27;re alone here</h1>
        <p className="excerpt">
          Oops! Looks like you tried to visit a page that does not exist.
        </p>
      </header>
      <div className="entry-content section-inner">{caught.statusText}</div>
    </article>
  );
}

export default function Page() {
  return <CatchBoundary />;
}
function findFirstFile(archivePath: any, basename: any) {
  throw new Error("Function not implemented.");
}
