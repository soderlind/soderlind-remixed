import React from "react";
import urlBuilder from "@sanity/image-url";
import { getImageDimensions } from "@sanity/asset-utils";
import type { SanityImageSource } from "@sanity/asset-utils";
import type { PortableTextComponentProps } from "@portabletext/react";
import { projectDetails } from "~/sanity/config";

type SanityImageAssetWithAlt = SanityImageSource & {
  alt?: string;
  alignment?: string;
  caption?: string;
  _key?: string;
};

export default function SanityImage(
  props: PortableTextComponentProps<SanityImageAssetWithAlt>
) {
  const { value, isInline } = props;
  const { width, height } = getImageDimensions(value);
  const id = value._key;

  const figStyle = value.alignment ? `wp-caption align${value.alignment}` : "";
  const figCaption = value.caption ? (
    <figcaption id="caption-attachment-{id}" className="wp-caption-text">
      {value.caption}
    </figcaption>
  ) : null;

  const imgStyle = "size-large wp-image-{id}";

  return (
    <figure
      id="attachment_{id}"
      aria-describedby={value.caption ? `caption-attachment-${id}` : ""}
      style={{ width: "672px" }}
      className={figStyle} //"wp-caption alignleft"
    >
      <a href={urlBuilder(projectDetails()).image(value).auto("format").url()}>
        <img
          className={imgStyle}
          src={urlBuilder(projectDetails())
            .image(value)
            .width(isInline ? 300 : 800)
            .fit("max")
            .auto("format")
            .url()}
          alt={value.caption || ""}
          loading="lazy"
          style={{
            display: isInline ? "inline-block" : "block",
            aspectRatio: width / height,
          }}
        />
      </a>
      {figCaption}
    </figure>
  );
}
