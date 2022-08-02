import { json } from "@remix-run/cloudflare";
import { Outlet, useLoaderData } from "@remix-run/react";
import { parseJSON } from "date-fns";
import { getPosts, Post } from "~/models/post.server";
import { IntlDate } from "~/helpers/IntlDate";

type LoaderData = {
  entries: Awaited<ReturnType<typeof getPosts>>;
};

export const loader = async () => {
  return json<LoaderData>({ entries: await getPosts() });
};

export default function Index() {
  // const data = useLoaderData() as LoaderData;

  const sticky = '<div className="sticky-arrow"></div>';
  return (
    <div className="section-inner">
      <header className="page-header">
        <h4 className="page-subtitle">Articles</h4>
        {/* <div className="page-description"></div> */}
      </header>
      <div className="posts" id="posts">
        <Outlet />
      </div>
    </div>
  );
}