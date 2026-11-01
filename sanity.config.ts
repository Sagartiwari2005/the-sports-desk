
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { projectId, dataset } from "./src/app/sanity/env";
import { schemaTypes } from "./src/app/sanity/schemaTypes";

export default defineConfig({
    name: "default",
    title: "The Sports Desk",
    basePath: "/studio",

    projectId,
    dataset,

    plugins: [structureTool()],

    schema: {
        types: schemaTypes,
    },
});
