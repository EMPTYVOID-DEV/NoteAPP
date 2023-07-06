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

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const envPath = path.join(__dirname, "../.env");
const logFilePath = path.join(__dirname, "serverLogs.txt");
const imagesPath = path.join(__dirname, "../images");

dotenv.config({
  path: envPath,
});

//strictQuery is deprecated
mongoose.set("strictQuery", false);

const app = express();

mongoose
  .connect(process.env.MONGO_URL, {
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
      `unable to connect to atlas database because of ${err} on ${Date()} \n`,
      { flag: "a" }
    );
  });

// environment setup

app.use(helmet());
app.use(morgan("common"));
app.use(express.json());
app.use(cookieParser());
app.use("/api/static/imgs", express.static(imagesPath));

//routers;
app.use("/api/auth", auth);

app.use("/api/user", verify, user);

app.use("/", (req, res) => res.send("working"));
