import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import groq from "groq";
import coy from "~/styles/prism.css";
import vsdark from "~/styles/prism-vsc-dark-plus.css";
import vslight from "~/styles/prism-vs.css";
import coynoshadows from "~/styles/prism-coy-without-shadows.css";

import Layout from "~/components/Layout";

import SanityContent from "~/components/SanityContent";
import { client } from "~/sanity/client";
import type { ProductDocument } from "~/sanity/types/Product";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: coynoshadows }];
};

export const loader: LoaderFunction = async ({ params }) => {
  const { slug } = params;
  const product = await client.fetch(
    groq`*[_type == "product" && slug.current == $slug][0]{ title, content }`,
    { slug }
  );

  if (!product) {
    return new Response("Not found", { status: 404 });
  }

  return { product };
};

export default function Product() {
  const { product } = useLoaderData<{ product: ProductDocument }>();

  return (
    <Layout>
      {product?.title ? (
        <h1 className="mb-6 text-2xl font-bold text-green-700 md:mb-12 md:text-4xl">
          {product.title}
        </h1>
      ) : null}
      {product?.content && product.content?.length > 0 ? (
        <SanityContent value={product.content} />
      ) : null}
    </Layout>
  );
}
