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
dotenv.config({
  path: "C:/Users/hp/Documents/study/OwnStudy/Projects/NoteApp/server/.env",
});

//strictQuery is deprecated
mongoose.set("strictQuery", false);

const app = express();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "SocialMedia",
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      fs.writeFileSync(
        "C:/Users/hp/Documents/study/OwnStudy/Projects/NoteApp/server/src/serverLogs.txt",
        `server start listening at localhost:${
          process.env.PORT
        } on ${Date()} \n`,
        { flag: "a" }
      );
    });
  })
  .catch((err) => {
    console.log(`${err} unable to connect`);
  });

// environment setup

app.use(helmet());
app.use(morgan("common"));
app.use(express.json());
app.use(cookieParser());
app.use(
  "/api/static/imgs",
  express.static(
    "C:/Users/hp/Documents/study/OwnStudy/Projects/NoteApp/server/images"
  )
);

//routers;
app.use("/api/auth", auth);

app.use("/api/user", verify, user);
