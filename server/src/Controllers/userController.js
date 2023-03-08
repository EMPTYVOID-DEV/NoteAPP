import user from "../models/user.js";

export const GetData = async (req, res) => {
  const _id = req.userid;
  const data = await user
    .findById(_id)
    .select("tags")
    .select("notes")
    .catch(() => {
      return res.status(503).send();
    });
  res.status(200).send({ tags: data.tags, notes: data.notes });
};
