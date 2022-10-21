import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { cache } from "~/utils/cache.server";

export const meta: MetaFunction = () => ({
  robots: "noindex,nofollow",
});

export const loader = async ({ params }: LoaderArgs) => {
  cache.del(cache.keys());
  return redirect("/");
};
