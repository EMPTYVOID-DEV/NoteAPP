import userModel from "../models/user.js";

export const createNote = async (req, res) => {
  const _id = req.userid;
  const note = JSON.parse(req.body.note);
  const user = await userModel.findById(_id).catch(() => {
    return res.status(503).send();
  });
  user.notes.set(`${req.body.id}`, note);
  await user.save().catch(() => {
    return res.status(503).send();
  });
  res.status(200).send();
};
export const deleteNote = async (req, res) => {
  const _id = req.userid;
  const noteid = req.body.noteid;
  const user = await userModel.findById(_id).catch(() => {
    return res.status(503).send();
  });
  user.notes.delete(noteid);
  await user.save().catch(() => {
    return res.status(503).send();
  });
  res.status(200).send();
};
