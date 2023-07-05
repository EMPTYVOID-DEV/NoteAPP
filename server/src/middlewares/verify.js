import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import * as url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const envPath = path.join(__dirname, "../../.env");

dotenv.config({
  envPath,
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
