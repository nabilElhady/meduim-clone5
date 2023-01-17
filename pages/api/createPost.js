const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  token: process.env.SANITY_API_TOKEN,
  useCdn: process.env.NODE_ENV === "production",
};
const sanityClient = require("@sanity/client");

const client = sanityClient(config);

export default async function createPost(req, res) {
  const { title, description, slug } = JSON.parse(req.body);
  try {
    await client.create({
      _type: "post",

      title,
      description,
      slug,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ name: "couldn't submit comment", err });
  }
  console.log("done");
  res.status(200).json({ name: "comment submited" });
}
