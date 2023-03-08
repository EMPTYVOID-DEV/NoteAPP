import { Router } from "express";
import { GetData } from "../Controllers/userController.js";
import { upload } from "../middlewares/multer.js";
import * as noteController from "../Controllers/noteController.js";
import * as tagController from "../Controllers/tagController.js";

const route = Router();

// intial load get everything
route.get("/", GetData);

//create new note

route.post("/note", upload.array("images", 5), noteController.createNote);

//delete note

route.delete("/note", noteController.deleteNote);

//add a tag

route.post("/tag", tagController.addTag);

// delete a tag

route.delete("/tag", tagController.deleteTag);

//update a tag

route.put("/tag", tagController.updateTag);

export default route;
