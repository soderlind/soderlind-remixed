import { redirect } from "@remix-run/cloudflare"; // or cloudflare/deno

export const loader = async () => {
  return redirect("/");
};
