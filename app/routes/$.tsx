// import { useLoaderData, useCatch } from "@remix-run/react";

export async function loader({}) {
  throw new Response("Not Found", {
    status: 404,
  });
}

export function CatchBoundary() {
  // let caught = useCatch();
  return (
    <article className="post">
      <div className="featured-image"></div>
      <header className="entry-header section-inner">
        <h1 className="entry-title">You&#x27;re alone here</h1>
        <p className="excerpt">
          Oops! Looks like you tried to visit a page that does not exist.
        </p>
      </header>
      {/* <div className="entry-content section-inner">{caught.statusText}</div> */}
    </article>
  );
}

export default function Page() {
  return <CatchBoundary />;
}
