import type { LoaderFunction } from "@remix-run/node"; // or cloudflare/deno
import { redirect } from "@remix-run/node"; // or cloudflare/deno
import { useCatch } from "@remix-run/react";
import { findByName } from "~/utils/fs.server";

type Path = {
  path: string;
};
type Paths = Path[];

const ignorePaths = ["/about", "/archive", "/post"];

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const path = url.pathname;
  const p = require("path");
  const archivePath = p.resolve("public/jekyll");

  const basename = p.basename(path);
  const dirname = p.dirname(path);

  const ignore = ignorePaths.some((oath) => dirname.startsWith(oath));
  if (!ignore) {
    const files = await findByName(archivePath, basename);

    if (files && files.length > 0) {
      const slug = files[0].replace(/\.[^/.]+$/, ""); // remove extension.
      return redirect(`/archive/${slug}`, 301);
    }
  }

  throw new Response("Not Found", {
    status: 404,
  });
};

export function CatchBoundary() {
  let caught = useCatch();
  return (
    <article className="post">
      <div className="featured-image"></div>
      <header className="entry-header section-inner">
        <h1 className="entry-title">You&#x27;re alone here</h1>
        <p className="excerpt">Oops! Looks like you tried to visit a page that does not exist.</p>
      </header>
      <div className="entry-content section-inner">{caught.statusText}</div>
    </article>
  );
}

export default function Page() {
  return <CatchBoundary />;
}
