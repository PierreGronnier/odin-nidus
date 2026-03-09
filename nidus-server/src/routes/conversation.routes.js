import { Router } from "express";
import {
  createConversationController,
  getUserConversationsController,
  getConversationByIdController,
  updateConversationController,
} from "../controllers/conversation.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createConversationValidator,
  updateConversationValidator,
} from "../validators/conversation.validator.js";

const conversationRouter = Router();

conversationRouter.get("/", authMiddleware, getUserConversationsController);
conversationRouter.post(
  "/",
  authMiddleware,
  createConversationValidator,
  createConversationController,
);
conversationRouter.get("/:id", authMiddleware, getConversationByIdController);
conversationRouter.put(
  "/:id",
  authMiddleware,
  updateConversationValidator,
  updateConversationController,
);

export { conversationRouter };
