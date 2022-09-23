import { Outlet, useLoaderData } from "@remix-run/react";

export default function Post() {
  return (
    <article className="post">
      <div className="featured-image"></div>
      <header className="entry-header section-inner">
        <h1 className="entry-title">Articles (from Sanity)</h1>
        <p className="excerpt"></p>
      </header>
      <div className="entry-content section-inner">
        <Outlet />
      </div>
    </article>
  );
}
