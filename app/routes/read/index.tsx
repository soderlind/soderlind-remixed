// https://www.goodreads.com/review/list_rss/25294857?key=L4RHPqV4KIVBscy-VbQnwcIGUoTWGFGDvkfJunVD6oOxiyT7&shelf=%23ALL%23
import { json, LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import Parser from "rss-parser";

const parser: Parser = new Parser({});

const myfeeds = [
  // "https://getpocket.com/users/soderlind/feed/all",
  "https://www.goodreads.com/review/list_rss/25294857?key=L4RHPqV4KIVBscy-VbQnwcIGUoTWGFGDvkfJunVD6oOxiyT7&shelf=%23ALL%23",
];

export async function loader() {
  const feeds = await Promise.all(
    myfeeds.map(async (feed) => {
      let feedData = await parser.parseURL(feed);
      return feedData;
    })
  );

  return json(feeds);
}

export default function Projects() {
  const feeds = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Projects</h1>
      <ul>
        {feeds.map((feed) =>
          feed.items.map((item) => (
            <li key={item.title}>
              <a href={item.link}>{item.title}</a>
              {item.content && (
                <div dangerouslySetInnerHTML={{ __html: item.content }}></div>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
