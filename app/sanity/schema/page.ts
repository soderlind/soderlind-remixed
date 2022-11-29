import { defineType, defineField } from "sanity";

export default defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: "title",
      },
    }),
    defineField({
      name: "ingress",
      type: "text",
      options: {
        charCount: true,
      },
    }),
    defineField({
      name: "content",
      type: "array" as const,
      of: [
        { type: "block" },
        {
          type: "image",
          fields: [
            {
              title: "Alignment",
              name: "alignment",
              type: "string",
              options: {
                list: [
                  { title: "None", value: "None" },
                  { title: "Left", value: "left" },
                  { title: "Right", value: "right" },
                  { title: "Center", value: "center" },
                ],
              },
            },
            {
              title: "Caption",
              name: "caption",
              type: "string",
            },
          ],
        },
        {
          title: "Code Block",
          type: "code",
          // icon: Code,
          options: {
            theme: "tomorrow",
            languageAlternatives: [
              { title: "TypeScript", value: "typescript" },
              { title: "Javascript", value: "javascript" },
              { title: "HTML", value: "html" },
              { title: "CSS", value: "css" },
              { title: "PHP", value: "php" },
            ],
          },
        },
      ],
    }),
  ],
});
