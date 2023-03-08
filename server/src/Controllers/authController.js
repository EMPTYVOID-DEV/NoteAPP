import bcrypt from "bcrypt";
import userModel from "../models/user.js";
import jwt from "jsonwebtoken";
import { createAccessToken, createRefreshToken } from "./jwtToken.js";
import dotenv from "dotenv";
dotenv.config({
  path: "C:/Users/hp/Documents/study/OwnStudy/Projects/NoteApp/server/.env",
});

const userResponse = async (res, userid) => {
  const refresh = createRefreshToken({ userid: userid });
  const access = createAccessToken({ userid: userid });
  res.cookie("api_auth", refresh, {
    httpOnly: true,
    secure: false,
  });
  res.set("authentication", access);
  res.status(200).send({ message: "authentication successful" });
};

const register = async (req, res) => {
  const isExist = await userModel.findOne({ email: req.body.email });
  if (isExist) return res.status(403).send({ message: "user already exists" });
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const newUser = await userModel
    .create({ email: req.body.email, password: hashedPassword })
    .catch(() => {
      return res.status(503).send();
    });
  userResponse(res, newUser._id);
};
const login = async (req, res) => {
  const oldUser = await userModel
    .findOne({ email: req.body.email })
    .catch((err) => {
      return res.status(503).send(err);
    });
  if (!oldUser) return res.status(404).send();
  const isValid = await bcrypt.compare(req.body.password, oldUser.password);
  if (isValid) {
    userResponse(res, oldUser._id);
  } else {
    res.status(403).send();
  }
};

const refresh = async (req, res) => {
  const clientToken = req.cookies.api_auth;
  let payload = null;
  if (!clientToken) return res.status(401).send();
  try {
    payload = jwt.verify(clientToken, process.env.REFRESH_TOKEN_KEY);
  } catch (err) {
    return res.status(401).send();
  }
  userResponse(res, payload.userid);
};

export { login, register, refresh };
