// import { useLoaderData, useCatch } from "@remix-run/react";

import type { LoaderFunction } from "@remix-run/cloudflare"; // or cloudflare/deno
import { redirect, json } from "@remix-run/cloudflare"; // or cloudflare/deno

type Path = {
  path: string;
};

type Paths = Path[];

// export async function loader({}) {
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const path = url.pathname;
  const paths = require("~/paths.json") as Paths;

  const pathMatch = paths.find((p) => p.path === path);

  if (pathMatch) {
    return redirect("/", 301);
  }

  throw new Response("Not Found", {
    status: 404,
  });
};

export function CatchBoundary() {
  // let caught = useCatch();
  return (
    <article className="post">
      <div className="featured-image"></div>
      <header className="entry-header section-inner">
        <h1 className="entry-title">You&#x27;re alone here</h1>
        <p className="excerpt">
          Oops! Looks like you tried to visit a page that does not exist.
        </p>
      </header>
      {/* <div className="entry-content section-inner">{caught.statusText}</div> */}
    </article>
  );
}

export default function Page() {
  return <CatchBoundary />;
}
