import { getImageDimensions, isAssetObjectStub } from "@sanity/asset-utils";
import type { SanityImageSource } from "@sanity/asset-utils";

import imageUrlBuilder from "@sanity/image-url";
import urlBuilder from "@sanity/image-url";
import { dataset, projectId } from "./sanity";

import { Code } from "~/components/Code";

const builder = imageUrlBuilder({ projectId, dataset });

const ImageComponent = ({
  value,
  isInline,
}: {
  value: SanityImageSource;
  isInline: boolean;
}) => {
  if (!isAssetObjectStub(value)) return undefined;

  const { width, height } = getImageDimensions(value);
  return (
    <img
      src={builder
        .image(value)
        .width(isInline ? 100 : 800)
        .fit("max")
        .auto("format")
        .url()}
      alt={value.alt || undefined}
      loading="lazy"
      style={{
        // Display alongside text if image appears inside a block text span
        display: isInline ? "inline-block" : "block",

        // Avoid jumping around with aspect-ratio CSS property
        aspectRatio: width / height,
      }}
    />
  );
};

export const CustomPortableTextComponents = {
  types: {
    image: ImageComponent,
    code: Code,

    // Any other custom types you have in your content
    // Examples: mapLocation, contactForm, code, featuredProjects, latestNews, etc.
  },
};
