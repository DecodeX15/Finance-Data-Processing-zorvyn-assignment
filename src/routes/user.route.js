import { Router } from "express";
import { create_user, login_user } from "../controllers/user.controller.js";
import {
  validatecreateuser,
  validateloginuser,
} from "../middleware/validate.middleware.js";
const userrouter = Router();
userrouter.post("/create", validatecreateuser, create_user);
userrouter.post("/login", validateloginuser, login_user);
export default userrouter;
