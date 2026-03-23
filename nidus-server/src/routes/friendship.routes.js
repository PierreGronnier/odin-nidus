import { Router } from "express";
import {
  getFriendsController,
  sendFriendRequestController,
  acceptFriendRequestController,
  declineFriendRequestController,
  blockUserController,
  removeFriendController,
  getPendingRequestsController,
  getSentRequestsController,
  cancelFriendRequestController,
} from "../controllers/friendship.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const friendshipRouter = Router();

friendshipRouter.get("/", authMiddleware, getFriendsController);
friendshipRouter.get("/pending", authMiddleware, getPendingRequestsController);
friendshipRouter.get("/sent", authMiddleware, getSentRequestsController);
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
friendshipRouter.delete(
  "/:friendshipId/cancel",
  authMiddleware,
  cancelFriendRequestController,
);

export { friendshipRouter };
