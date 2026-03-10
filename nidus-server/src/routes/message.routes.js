import { Router } from "express";
import {
  createMessageController,
  getMessagesController,
  updateMessageController,
  deleteMessageController,
} from "../controllers/message.controller.js";
import { messageValidator } from "../validators/message.validator.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const messageRouter = Router({ mergeParams: true });

messageRouter.get("/", authMiddleware, getMessagesController);
messageRouter.post(
  "/",
  authMiddleware,
  messageValidator,
  createMessageController,
);
messageRouter.put(
  "/:messageId",
  authMiddleware,
  messageValidator,
  updateMessageController,
);
messageRouter.delete("/:messageId", authMiddleware, deleteMessageController);

export { messageRouter };
