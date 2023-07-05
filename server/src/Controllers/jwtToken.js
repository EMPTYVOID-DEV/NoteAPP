import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import * as url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const envPath = path.join(__dirname, "../../.env");

dotenv.config({
  path: envPath,
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
