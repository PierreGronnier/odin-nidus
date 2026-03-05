import { Router } from "express";
import {
  registerController,
  loginController,
  logoutController,
  refreshController,
} from "../controllers/auth.controller.js";
import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator.js";

const authRouter = Router();

authRouter.post("/register", registerValidator, registerController);
authRouter.post("/login", loginValidator, loginController);
authRouter.post("/logout", logoutController);
authRouter.post("/refresh", refreshController);

export { authRouter };
