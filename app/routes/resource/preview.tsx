import type { ActionFunction, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { getSession, commitSession, destroySession } from "~/sessions";

// A `POST` request to this route will exit preview mode
export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }

  const session = await getSession(request.headers.get("Cookie"));

  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};

// A `GET` request to this route will enter preview mode
export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");
  const redirectUrl = slug ? `/posts/${slug}` : `/posts`;

  const session = await getSession(request.headers.get("Cookie"));
  // For a more advanced use case, you could use this
  // to store a read token from sanity.io/manage
  session.set(`preview`, `a-random-string`);

  return redirect(redirectUrl, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};
