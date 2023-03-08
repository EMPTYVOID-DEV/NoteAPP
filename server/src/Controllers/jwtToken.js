import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({
  path: "C:/Users/hp/Documents/study/OwnStudy/Projects/NoteApp/server/.env",
});

export const createAccessToken = (playload) => {
  return jwt.sign(playload, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: "10m",
  });
};
export const createRefreshToken = (playload) => {
  return jwt.sign(playload, process.env.REFRESH_TOKEN_KEY, {
    expiresIn: "5d",
  });
};
