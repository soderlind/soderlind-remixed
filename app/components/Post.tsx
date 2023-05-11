import { PortableText } from "@portabletext/react";
import { FormatDate } from "./FormatDate";
import { Link } from "@remix-run/react";
import { parseJSON } from "date-fns";
import imageUrlBuilder from "@sanity/image-url";
import { projectId, dataset } from "~/lib/sanity";

import { CustomPortableTextComponents } from "~/lib/PortabletextComponents";

const builder = imageUrlBuilder({ projectId, dataset });

export function Post(post) {
  const p = post.post;
  const date = parseJSON(p._updatedAt);

  return (
    <article className="post">
      {p?.mainImage ? (
        <div className="featured-image">
          {" "}
          <img
            // className="float-left m-0 w-1/3 mr-4 rounded-lg"
            src={builder
              .image(p?.mainImage)
              //   .width(300)
              //   .height(300)
              //   .quality(80)
              .url()}
            // width={300}
            // height={300}
            alt={p?.title}
          />
        </div>
      ) : null}
      <header className="entry-header section-inner">
        {p?.title ? <h2 className="entry-title">{p.title}</h2> : null}
        {p?.ingress ? <p className="excerpt">{p.ingress} </p> : null}
        <div className="meta">
          Updated: <FormatDate date={date} pattern="d.M.yyyy" />
        </div>
      </header>
      <div className="entry-content section-inner">
        {p?.body ? (
          <PortableText
            value={p.body}
            components={CustomPortableTextComponents}
            // onMissingComponent={false}
          />
        ) : null}
        <div className="post-nav">
          <Link className="meta" to="/posts/">
            ← Posts index
          </Link>
        </div>
      </div>
    </article>
  );
}
