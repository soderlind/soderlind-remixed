import styles from "highlight.js/styles/night-owl.css";
import { Outlet } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/cloudflare"; // or cloudflare/deno
import { redirect, json } from "@remix-run/cloudflare"; // or cloudflare/deno

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const path = url.pathname;
  // import Component, { attributes, filename } from `"~${url.pathname}.md"`;
  // const content = require(`"${url.pathname}"`);
  // console.log(url.pathname);
  // console.log(content);
  return null;
};

export const links = () => {
  return [
    {
      rel: "stylesheet",
      href: styles,
    },
  ];
};

export default function Old() {
  return (
    <div className="section-inner">
      <header className="page-header">
        <h4 className="page-subtitle">Articles</h4>
        {/* <div className="page-description"></div> */}
      </header>
      <div className="posts" id="posts">
        <article className="post">
          <Outlet />
        </article>
      </div>
    </div>
  );
}
