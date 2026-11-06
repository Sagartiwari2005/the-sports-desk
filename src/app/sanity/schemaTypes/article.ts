
import { defineType, defineField } from "sanity";

export const article = defineType({
    name: "article",
    title: "Articles",
    type: "document",

    fields: [
        defineField({
            name: "title",
            title: "Headline",
            type: "string",
            validation: (Rule) => Rule.required().max(120),
        }),

        defineField({
            name: "subtitle",
            title: "Subtitle",
            type: "text",
            rows: 2,
        }),

        defineField({
            name: "slug",
            title: "URL Slug",
            type: "slug",
            options: {
                source: "title",
                maxLength: 96,
            },
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: "author",
            title: "Author",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: "sport",
            title: "Sport",
            type: "string",
            description: "Select the sport this article covers.",
            options: {
                list: [
                    { title: "Football", value: "football" },
                    { title: "NFL", value: "nfl" },
                    { title: "Basketball", value: "basketball" },
                    { title: "Cricket", value: "cricket" },
                    { title: "Other Sports", value: "other" },
                ],
                layout: "dropdown",
            },
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: "section",
            title: "Editorial Section",
            type: "string",
            description: "Choose the editorial section where this article belongs.",
            options: {
                list: [
                    { title: "News", value: "news" },
                    { title: "Analysis", value: "analysis" },
                    { title: "Opinion", value: "opinion" },
                    { title: "Features", value: "features" },
                    { title: "Culture", value: "culture" },
                ],
                layout: "dropdown",
            },
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: "category",
            title: "Category",
            type: "string",
            options: {
                list: [
                    "Football",
                    "Tactical Analysis",
                    "Football Culture",
                    "Opinion",
                    "The Big Picture",
                    "NFL",
                    "Basketball",
                    "Cricket",
                ],
            },
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: "excerpt",
            title: "Article Summary",
            type: "text",
            rows: 3,
            validation: (Rule) => Rule.max(300),
        }),

        defineField({
            name: "mainImage",
            title: "Featured Image",
            type: "image",
            options: {
                hotspot: true,
            },
        }),

        defineField({
            name: "body",
            title: "Article Content",
            type: "array",
            of: [
                {
                    type: "block",
                    styles: [
                        { title: "Normal", value: "normal" },
                        { title: "Heading 2", value: "h2" },
                        { title: "Heading 3", value: "h3" },
                        { title: "Quote", value: "blockquote" },
                    ],
                },
                {
                    type: "image",
                    options: { hotspot: true },
                },
            ],
        }),

        defineField({
            name: "publishedAt",
            title: "Publication Date",
            type: "datetime",
        }),

        defineField({
            name: "featured",
            title: "Featured Article",
            type: "boolean",
            initialValue: false,
        }),
    ],

    preview: {
        select: {
            title: "title",
            subtitle: "category",
            media: "mainImage",
        },
    },
});
