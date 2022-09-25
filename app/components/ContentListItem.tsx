import { Link } from "@remix-run/react";
import { parseJSON } from "date-fns";
import { Post } from "~/models/post.server";
import { FormatDate } from "./FormatDate";

type PrefetchBehavior = "intent" | "none" | "render";

type ContentListItemProps = {
  post: Post;
  date: string;
  urlPrefix?: string | "";
  prefetch?: string | "";
};

const ContentListItem = ({
  post,
  date,
  urlPrefix = "",
  prefetch = "none",
}: ContentListItemProps) => {
  return (
    <li
      key={"post-" + post.slug}
      className="post-preview"
      id={"post-" + post.slug}
    >
      <Link
        key={"link-" + post.slug}
        to={urlPrefix + post.slug}
        className=""
        prefetch="{prefetch}"
      >
        <h2 className="title">
          <span>{post.title}</span>
        </h2>

        <FormatDate
          key={"date-" + post.slug}
          date={parseJSON(date)}
          timeZone="CET"
        />
      </Link>
    </li>
  );
};

export default ContentListItem;