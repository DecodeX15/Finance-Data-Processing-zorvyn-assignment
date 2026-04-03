import { Router } from "express";
import {
  create_user,
  get_all_users,
  login_user,
} from "../controllers/user.controller.js";
import {
  validatecreateuser,
  validateloginuser,
} from "../middleware/validate.middleware.js";
import {
  change_user_role,
  change_user_status,
} from "../controllers/user.controller.js";
import { auth_middleware } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/rolaccess.middlware.js";
const userrouter = Router();
userrouter.post("/create", validatecreateuser, create_user);
userrouter.post("/login", validateloginuser, login_user);
// admin accessible routes only
userrouter.post(
  "/change-role",
  auth_middleware,
  requireAdmin,
  change_user_role,
);

userrouter.post(
  "/change-user-status",
  auth_middleware,
  requireAdmin,
  change_user_status,
);

userrouter.get("/all-users", auth_middleware, requireAdmin, get_all_users);
export default userrouter;
