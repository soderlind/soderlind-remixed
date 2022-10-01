import type { LoaderFunction } from "@remix-run/node"; // or cloudflare/deno
import { redirect } from "@remix-run/node"; // or cloudflare/deno
import { useCatch } from '@remix-run/react';

type Path = {
  path: string;
};
type Paths = Path[];

const ignorePaths = [
	"/about",
	"/archive",
	"/post",
];

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const path = url.pathname;
  const paths = require("~/paths.json") as Paths;
  const p = require("path");
  const basename = p.basename(path);
	const dirname = p.dirname(path);

	const ignore = ignorePaths.some((oath) => dirname.startsWith(oath));
	if (!ignore) {
		const regexp = new RegExp(`${basename}`, "i");
		const pathMatch = paths.find((p) => regexp.test(p.path));

		if (pathMatch) {
			const slug = pathMatch.path.replace(/\.[^/.]+$/, ""); // remove extension.

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


