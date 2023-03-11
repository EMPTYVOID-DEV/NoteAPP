import userModel from "../models/user.js";

export const createNote = async (req, res) => {
  const _id = req.userid;
  const note = JSON.parse(req.body.note);
  let user = null;
  try {
    user = await userModel.findById(_id);
  } catch (error) {
    return res.status(503).send();
  }
  user.notes.set(`${req.body.id}`, note);
  try {
    await user.save();
  } catch (error) {
    return res.status(503).send();
  }
  res.status(200).send();
};
export const deleteNote = async (req, res) => {
  const _id = req.userid;
  const noteid = req.params.noteid;
  let user = null;
  try {
    user = await userModel.findById(_id);
  } catch (error) {
    return res.status(503).send();
  }
  user.notes.delete(noteid);
  try {
    await user.save();
  } catch (error) {
    return res.status(503).send();
  }
  res.status(200).send();
};
