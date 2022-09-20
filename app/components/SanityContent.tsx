import React from "react";
import { PortableText } from "@portabletext/react";
import SanityImage from "./SanityImage";
import { Code } from "./Code";

type ContentProps = {
  value: any[];
};

const components = {
  types: {
    image: SanityImage,
    code: Code,
  },
};

export default function SanityContent(props: ContentProps) {
  const { value } = props;

  return (
    <div className="prose prose-a:text-green-600">
      <PortableText value={value} components={components} />
    </div>
  );
}
