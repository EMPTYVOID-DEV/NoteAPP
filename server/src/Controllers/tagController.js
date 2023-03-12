import userModel from "../models/user.js";

export const addOrEditTag = async (req, res) => {
  const { key, val } = req.body;
  if (!key || !val) return res.status(400).send();
  const _id = req.userid;
  let user = null;
  try {
    user = await userModel.findById(_id);
  } catch (error) {
    return res.status(503).send();
  }
  user.tags.set(key, val);
  try {
    await user.save();
  } catch (error) {
    return res.status(503).send();
  }
  res.status(200).send();
};

export const deleteTag = async (req, res) => {
  const _id = req.userid;
  const KEY = req.params.key;
  if (!KEY) return res.status(400).send();
  let user = null;
  try {
    user = await userModel.findById(_id);
  } catch (error) {
    return res.status(503).send();
  }
  user.tags.delete(KEY);
  const noteMap = user.notes;
  for (const [key, val] of noteMap.entries()) {
    const index = val.tags.indexOf(KEY);
    if (index > -1) {
      val.tags.splice(index, 1);
    }
    noteMap.set(key, val);
  }
  try {
    await user.save();
  } catch (error) {
    return res.status(503).send();
  }
  res.status(200).send();
};

export const replaceTags = async (req, res) => {
  const id = req.userid;
  let { Tags } = req.body;
  if (!Tags) return res.status(400).send();
  let user = null;
  try {
    user = await userModel.findById(id);
  } catch (error) {
    return res.status(503).send();
  }
  Tags = new Map(Object.entries(Tags));

  for (const [key, val] of user.notes.entries()) {
    val.tags = val.tags.filter((el) => {
      return Tags.has(el);
    });

    user.notes.set(key, val);
  }
  user.tags = Tags;
  try {
    await user.save();
  } catch (error) {
    return res.status(503).send();
  }
  res.status(200).send();
};
