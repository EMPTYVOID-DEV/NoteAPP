import user from "../models/user.js";

export const GetData = async (req, res) => {
  const _id = req.userid;
  let data = null;
  try {
    data = await user.findById(_id).select("tags").select("notes");
  } catch (error) {
    return res.status(503).send();
  }
  res
    .status(200)
    .send({
      tags: Object.fromEntries(data.tags),
      notes: Object.fromEntries(data.notes),
    });
};
