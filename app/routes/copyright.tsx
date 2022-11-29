export default function About() {
  return (
    <article className="post">
      <div className="featured-image"></div>
      <header className="entry-header section-inner">
        <h1 className="entry-title">Copyright</h1>
        {/* <p className="excerpt">TODO: excerpt excerpt excerpt excerpt </p> */}
      </header>
      <div className="entry-content section-inner">
        <p>
          Content on this site is copyright © {new Date().getFullYear()} Per
          Søderlind. All rights reserved.
        </p>
      </div>
    </article>
  );
}
