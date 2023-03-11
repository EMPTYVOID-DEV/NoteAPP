import { Router } from "express";
import { GetData } from "../Controllers/userController.js";
import { upload } from "../middlewares/multer.js";
import * as noteController from "../Controllers/noteController.js";
import * as tagController from "../Controllers/tagController.js";

const route = Router();

// intial load get everything
route.get("/", GetData);

//create new or update note

route.post("/note", upload.single("image"), noteController.createNote);

//delete note

route.delete("/note/:noteid", noteController.deleteNote);

//add or update a tag

route.post("/tag", tagController.addOrEditTag);

// delete a tag

route.delete("/tag/:key", tagController.deleteTag);

export default route;
