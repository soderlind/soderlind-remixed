import type { LinksFunction, ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
// import { redirect } from "@remix-run/node";
import { ClientOnly } from "remix-utils";
import { Studio } from "sanity";

import { config } from "~/sanity/config";
import { authenticator } from "~/services/auth.server";

import styles from "~/styles/studio.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export async function loader({ request }: LoaderArgs) {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  return json({ user });
}

export default function StudioPage() {
  return <ClientOnly>{() => <Studio config={config} />}</ClientOnly>;
}
