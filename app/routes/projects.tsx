import { Outlet } from "@remix-run/react";

export default function About() {
  // const { post, html } = useLoaderData() as LoaderData;
  return (
    <article className="post">
      <div className="featured-image"></div>
      <header className="entry-header section-inner">
        <h1 className="entry-title">Projects</h1>
        <p className="excerpt">
          Here's <a href="https://github.com/soderlind?tab=repositories">my projects at GitHub</a>
        </p>
      </header>
      <div className="entry-content section-inner">
        <Outlet />
      </div>
    </article>
  );
}
