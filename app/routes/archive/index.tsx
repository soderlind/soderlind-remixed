import styles from "highlight.js/styles/night-owl.css";
import { Outlet } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node"; // or cloudflare/deno
import { redirect, json } from "@remix-run/node"; // or cloudflare/deno

import { Link, useLoaderData } from "@remix-run/react";

import { getPosts } from "~/utils/mdx";
import type { Mdx } from "~/utils/mdx";

export const loader: LoaderFunction = async () => {
  // return json<{ entries: Mdx[] }>({ entries: await getPosts() });
  return getPosts() as Promise<Mdx[]>;
};
export const links = () => {
  return [
    {
      rel: "stylesheet",
      href: styles,
    },
  ];
};
export default function Posts() {
  const posts = useLoaderData<Mdx[]>();
  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link to={post.slug}>
              {post.date}
              {}
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// export const loader: LoaderFunction = async ({ request }) => {
//   const url = new URL(request.url);
//   const path = url.pathname;
//   // import Component, { attributes, filename } from `"~${url.pathname}.md"`;
//   // const content = require(`"${url.pathname}"`);
//   // console.log(url.pathname);
//   // console.log(content);
//   return null;
// };

// export const links = () => {
//   return [
//     {
//       rel: "stylesheet",
//       href: styles,
//     },
//   ];
// };

// export default function Old() {
//   return (
//     <div className="section-inner">
//       <header className="page-header">
//         <h4 className="page-subtitle">Articles</h4>
//         {/* <div className="page-description"></div> */}
//       </header>
//       <div className="posts" id="posts">
//         <article className="post">
//           <Outlet />
//         </article>
//       </div>
//     </div>
//   );
// }
