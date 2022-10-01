
// export async function loader(args: LoaderArgs) {
//   return redirect("/posts");
// }

export default function Index() {
  return (
    <article className="post">
      <div className="featured-image"></div>
      <header className="entry-header section-inner">
        <h1 className="entry-title">Per Søderlind</h1>
        <p className="excerpt">TODO: excerpt excerpt excerpt excerpt </p>
      </header>
      <div className="entry-content section-inner">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maxime eum
        pariatur odit similique enim recusandae, impedit quo expedita commodi
        eaque cupiditate beatae eligendi ipsa debitis mollitia asperiores iste
        minus ducimus.
      </div>
    </article>
  );
}
