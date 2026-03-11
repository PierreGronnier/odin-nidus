import {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  getFriends,
  blockUser,
  removeFriend,
} from "../services/friendship.service.js";

async function getFriendsController(req, res, next) {
  try {
    const userId = req.user.id;
    const friendList = await getFriends(userId);
    res.status(200).json(friendList);
  } catch (error) {
    next(error);
  }
}

async function sendFriendRequestController(req, res, next) {
  try {
    const requesterId = req.user.id;
    const receiverId = req.body.receiverId;
    const friendRequest = await sendFriendRequest(requesterId, receiverId);
    res.status(201).json(friendRequest);
  } catch (error) {
    next(error);
  }
}

async function acceptFriendRequestController(req, res, next) {
  try {
    const friendshipId = req.params.friendshipId;
    const acceptRequest = await acceptFriendRequest(friendshipId);
    res.status(200).json(acceptRequest);
  } catch (error) {
    next(error);
  }
}

async function declineFriendRequestController(req, res, next) {
  try {
    const friendshipId = req.params.friendshipId;
    const declineRequest = await declineFriendRequest(friendshipId);
    res.status(200).json(declineRequest);
  } catch (error) {
    next(error);
  }
}

async function blockUserController(req, res, next) {
  try {
    const friendshipId = req.params.friendshipId;
    const blockRequest = await blockUser(friendshipId);
    res.status(200).json(blockRequest);
  } catch (error) {
    next(error);
  }
}

async function removeFriendController(req, res, next) {
  try {
    const friendshipId = req.params.friendshipId;
    const unfriendRequest = await removeFriend(friendshipId);
    res.status(200).json(unfriendRequest);
  } catch (error) {
    next(error);
  }
}

export {
  getFriendsController,
  sendFriendRequestController,
  acceptFriendRequestController,
  declineFriendRequestController,
  blockUserController,
  removeFriendController,
};
