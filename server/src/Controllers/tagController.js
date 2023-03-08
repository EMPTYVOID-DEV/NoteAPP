import userModel from "../models/user.js";

export const addTag = async (req, res) => {
  const { key, val } = req.body;
  if (!key || !val) return res.status(400).send();
  const _id = req.userid;
  const user = await userModel.findById(_id).catch(() => {
    return res.status(503).send();
  });
  user.tags.set(key, val);
  await user.save().catch(() => {
    return res.status(503).send();
  });
  res.status(200).send();
};
export const deleteTag = async (req, res) => {
  const _id = req.userid;
  const KEY = req.body.key;
  if (!KEY) return res.status(400).send();
  const user = await userModel.findById(_id).catch(() => {
    return res.status(503).send();
  });
  user.tags.delete(KEY);
  const noteMap = user.notes;
  for (const [key, val] of noteMap.entries()) {
    const index = val.tags.indexOf(KEY);
    if (index > -1) {
      val.tags.splice(index, 1);
    }
    noteMap.set(key, val);
  }
  await user.save().catch(() => {
    return res.status(503).send();
  });
  res.status(200).send();
};
export const updateTag = async (req, res) => {
  const { key, val } = req.body;
  if (!key || !val) return res.status(400).send();
  const _id = req.userid;
  const user = await userModel.findById(_id).catch(() => {
    return res.status(503).send();
  });
  user.tags.set(key, val);
  await user.save().catch(() => {
    return res.status(503).send();
  });
  res.status(200).send();
};
