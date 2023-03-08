import { Router } from "express";
import * as authController from "../Controllers/authController.js";

const route = Router();

// register route
route.post("/register", authController.register);

// login route
route.post("/login", authController.login);

// intialLoad route
route.get("/refresh", authController.refresh);

export default route;
