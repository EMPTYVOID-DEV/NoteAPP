import bcrypt from "bcrypt";
import userModel from "../models/user.js";
import jwt from "jsonwebtoken";
import { createAccessToken, createRefreshToken } from "./jwtToken.js";
import dotenv from "dotenv";
import path from "path";
import * as url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const envPath = path.join(__dirname, "../../.env");

dotenv.config({
  path: envPath,
});

const userResponse = async (res, userid) => {
  const refresh = createRefreshToken({ userid: userid });
  const access = createAccessToken({ userid: userid });
  res.cookie("apiauth", refresh, {
    httpOnly: true,
    secure: false,
    maxAge: 24 * 60 * 60 * 5 * 1000,
  });
  res.set("authentication", access);
  res.status(200).send({ message: "authentication successful" });
};

const register = async (req, res) => {
  const isExist = await userModel.findOne({ email: req.body.email });
  if (isExist) return res.status(404).send({ message: "user already exists" });
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  let newUser = null;
  try {
    newUser = await userModel.create({
      email: req.body.email,
      password: hashedPassword,
    });
  } catch (error) {
    return res.status(503).send();
  }
  userResponse(res, newUser._id);
};
const login = async (req, res) => {
  let oldUser = null;
  try {
    oldUser = await userModel.findOne({ email: req.body.email });
  } catch (error) {
    return res.status(503).send();
  }
  if (!oldUser) return res.status(404).send();
  const isValid = await bcrypt.compare(req.body.password, oldUser.password);
  if (isValid) {
    userResponse(res, oldUser._id);
  } else {
    res.status(403).send();
  }
};

const refresh = async (req, res) => {
  const clientToken = req.cookies.apiauth;
  let payload = null;
  if (!clientToken) return res.status(401).send("no token");
  try {
    payload = jwt.verify(clientToken, process.env.REFRESH_TOKEN_KEY);
  } catch (err) {
    return res.status(401).send("token is forged");
  }
  userResponse(res, payload.userid);
};

export { login, register, refresh };
