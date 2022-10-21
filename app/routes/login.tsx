import { Outlet } from "@remix-run/react";

export default function About() {
  // const { post, html } = useLoaderData() as LoaderData;
  return (
    <article className="post">
      <div className="featured-image" />
      <header className="page-header section-inner">
        <h1 className="entry-title">Login</h1>
      </header>
      <div className="entry-content section-inner">
        <Outlet />
      </div>
    </article>
  );
}
