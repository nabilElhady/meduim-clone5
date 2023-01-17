import createImageUrlBuilder from "@sanity/image-url";
import { createClient, groq } from "next-sanity";

const config = {
  dataset: "production",
  projectId: "jnvpipqq",
  apiVersion: "1",
};

export const sanityClient = createClient(config);

export const urlFor = (source) => createImageUrlBuilder(config).image(source);
