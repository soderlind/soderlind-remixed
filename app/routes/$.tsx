import type { LoaderArgs } from "@remix-run/node"; // or cloudflare/deno
import { redirect } from "@remix-run/node"; // or cloudflare/deno
import {
  isRouteErrorResponse,
  useCatch,
  useRouteError,
} from "@remix-run/react";
import { isDefinitelyAnError } from "~/lib/utils";
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

export function ErrorBoundary() {
  const error = useRouteError();

  // when true, this is what used to go to `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>Oops</h1>
        <p>Status: {error.status}</p>
        <p>{error.data.message}</p>
      </div>
    );
  }

  // Don't forget to typecheck with your own logic.
  // Any value can be thrown, not just errors!
  let errorMessage = "Unknown error";
  if (isDefinitelyAnError(error)) {
    errorMessage = error.message;
  }

  return (
    <div>
      <h1>Uh oh ...</h1>
      <p>Something went wrong.</p>
      <pre>{errorMessage}</pre>
    </div>
  );
}

export default function Page() {
  return <ErrorBoundary />;
}
function findFirstFile(archivePath: any, basename: any) {
  throw new Error("Function not implemented.");
}
