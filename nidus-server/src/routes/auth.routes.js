import { Router } from "express";
import passport from "../config/passport.js";
import {
  registerController,
  loginController,
  logoutController,
  refreshController,
  googleAuthController,
} from "../controllers/auth.controller.js";
import {
  registerValidator,
  loginValidator,
} from "../validators/auth.validator.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", registerValidator, registerController);
authRouter.post("/login", loginValidator, loginController);
authRouter.post("/logout", authMiddleware, logoutController);
authRouter.post("/refresh", refreshController);

// Routes google OAuth
// Redirige vers Google
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] }),
);

// Google redirige ici après connexion
authRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleAuthController,
);

export { authRouter };
