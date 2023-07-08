import mongoose from "mongoose";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import fs from "fs";
import auth from "./routes/authenticateRoute.js";
import user from "./routes/userRoute.js";
import { verify } from "./middlewares/verify.js";
import path from "path";
import * as url from "url";

//paths

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const envPath = path.join(__dirname, "../.env");
const logFilePath = path.join(__dirname, "serverLogs.txt");
const imagesPath = path.join(__dirname, "../images");
const buildPath = path.join(__dirname, "../../client/dist");
dotenv.config({
  path: envPath,
});

//app && environment
const env = process.argv[2] || "dev";
const app = express();

// database configuration
//strictQuery is deprecated

const databaseURL =
  env == "dev" ? "mongodb://127.0.0.1:27017" : process.env.MONGO_URL;
mongoose.set("strictQuery", false);
mongoose
  .connect(databaseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "NoteApp",
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      fs.writeFileSync(
        logFilePath,
        `server start listening at localhost:${
          process.env.PORT
        } on ${Date()} \n`,
        { flag: "a" }
      );
    });
  })
  .catch((err) => {
    fs.writeFileSync(
      logFilePath,
      `unable to connect to database because of ${err} on ${Date()} \n`,
      { flag: "a" }
    );
  });

// global middlewares

app.use(express.static(buildPath));
app.use(helmet());
app.use(morgan("common"));
app.use(express.json());
app.use(cookieParser());
app.use("/api/static/imgs", express.static(imagesPath));

//routes;
app.use("/api/auth", auth);

app.use("/api/user", verify, user);

// redirects unknown requests to react router
app.use("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});
