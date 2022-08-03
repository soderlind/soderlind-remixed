/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  cacheDirectory: "./node_modules/.cache/remix",
  ignoredRouteFiles: ["**/.*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],
  serverDependenciesToBundle: [
    /^rehype.*/,
    /^remark.*/,
    /^unified.*/,
    "marked",
    "mdx-bundler",
    "micromark-extension-gfm",
    "hast-util-has-property",
    "mdast-util-gfm",
    "lowlight",
    "hast-util-heading-rank",
    "hast-util-to-text",
    "hast-util-to-string",
    "unist-util-visit",
    "hast-util-is-element",
  ],
  mdx: async (filename) => {
    const [rehypeHighlight] = await Promise.all([
      import("rehype-highlight").then((mod) => mod.default),
    ]);
    return {
      rehypePlugins: [rehypeHighlight],
    };
  },
};
