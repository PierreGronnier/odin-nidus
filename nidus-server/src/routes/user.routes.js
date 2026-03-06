import { Router } from "express";
import { getUser, updateUserInfo } from "../controllers/user.controller.js";
import { updateUserValidator } from "../validators/user.validator.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get("/me", authMiddleware, getUser);
userRouter.put("/me", authMiddleware, updateUserValidator, updateUserInfo);

export { userRouter };
