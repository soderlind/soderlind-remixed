import { LoaderArgs, MetaFunction, redirect } from "@remix-run/node";
import { cache } from "~/utils/cache.server";

export const meta: MetaFunction = () => ({
  robots: "noindex,nofollow",
});

export const loader = async ({ params }: LoaderArgs) => {
  // cache.keys().map((key) => cache.del(key));
  cache.del(cache.keys());
  return redirect("/");
};
