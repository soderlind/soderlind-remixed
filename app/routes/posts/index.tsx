import type { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import groq from "groq";

import Layout from "~/components/Layout";
import { client } from "~/sanity/client";
import type { Page } from "~/sanity/types/Page";

export const loader: LoaderFunction = async () => {
  const pages = await client.fetch(
    groq`*[_type == "page"]{ _id, title, slug }`
  );

  return { pages };
};

export default function Index() {
  const { pages } = useLoaderData<{ pages: Page[] }>();

  return (
    <Layout>
      {pages.length > 0 ? (
        <ul className="grid grid-cols-1 gap-6">
          {pages.map((page) => (
            <li key={page._id} className="rounded bg-white p-6 shadow md:p-12">
              {page?.slug?.current ? (
                <Link
                  prefetch="render"
                  to={page?.slug?.current}
                  className="text-xl font-bold text-green-600 underline hover:text-green-400"
                >
                  {page.title}
                </Link>
              ) : (
                <span className="text-xl font-bold">{page.title}</span>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </Layout>
  );
}
