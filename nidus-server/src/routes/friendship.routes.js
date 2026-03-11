import { Router } from "express";
import {
  getFriendsController,
  sendFriendRequestController,
  acceptFriendRequestController,
  declineFriendRequestController,
  blockUserController,
  removeFriendController,
} from "../controllers/friendship.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const friendshipRouter = Router();

friendshipRouter.get("/", authMiddleware, getFriendsController);
friendshipRouter.post("/", authMiddleware, sendFriendRequestController);
friendshipRouter.put(
  "/:friendshipId/accept",
  authMiddleware,
  acceptFriendRequestController,
);
friendshipRouter.put(
  "/:friendshipId/decline",
  authMiddleware,
  declineFriendRequestController,
);
friendshipRouter.put(
  "/:friendshipId/block",
  authMiddleware,
  blockUserController,
);
friendshipRouter.delete(
  "/:friendshipId",
  authMiddleware,
  removeFriendController,
);

export { friendshipRouter };
