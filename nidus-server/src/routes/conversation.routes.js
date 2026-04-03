import { Router } from "express";
import {
  createConversationController,
  getUserConversationsController,
  getConversationByIdController,
  updateConversationController,
  deleteConversationController,
  addParticipantsController,
  removeParticipantController,
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
conversationRouter.get(
  "/:conversationId",
  authMiddleware,
  getConversationByIdController,
);
conversationRouter.put(
  "/:conversationId",
  authMiddleware,
  updateConversationValidator,
  updateConversationController,
);
conversationRouter.delete(
  "/:conversationId",
  authMiddleware,
  deleteConversationController,
);
conversationRouter.put(
  "/:conversationId/participants",
  authMiddleware,
  addParticipantsController,
);
conversationRouter.delete(
  "/:conversationId/participants",
  authMiddleware,
  removeParticipantController,
);

export { conversationRouter };
