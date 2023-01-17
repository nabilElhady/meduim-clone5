// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const config = {
  dataset: "production",
  projectId: jnvpipqq,
  token:
    "sk0m6HZnR2UtNNVgG7SiTgTJjAffJcpHyg7OEIkN2jx3ei9sQISY8pHhB7TlGJ5CzybQfNn54hUUKh11k8UlJtyMtIuFevNKCs0ZgeqLoTPeH8b1uSRDYxvhQaxLV0baJe7ZgTo630g7V1WclswuVu1463PJxTVkcGWiWaQRChvKAjwWukGZ",
  useCdn: process.env.NODE_ENV === "production",
};
const sanityClient = require("@sanity/client");

const client = sanityClient(config);
export default async function createComment(req, res) {
  const { _id, name, email, comment } = JSON.parse(req.body);
  try {
    await client.create({
      _type: "comment",
      post: {
        _type: "reference",
        _ref: _id,
      },
      name,
      email,
      comment,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ name: "couldn't submit comment", err });
  }
  console.log("done");
  res.status(200).json({ name: "comment submited" });
}
