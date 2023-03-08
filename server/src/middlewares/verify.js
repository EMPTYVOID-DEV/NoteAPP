import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({
  path: "C:/Users/hp/Documents/study/OwnStudy/Projects/NoteApp/server/.env",
});

export const verify = (req, res, next) => {
  const authHeader = req.headers["authentication"];
  if (!authHeader) return res.status(401).send("no header");
  const token = authHeader.split(" ")[1];
  let payload = null;
  try {
    payload = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
  } catch (err) {
    return res.status(401).send("expired");
  }
  req.userid = payload.userid;
  next();
};
