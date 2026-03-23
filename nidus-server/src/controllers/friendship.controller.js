import {
  sendFriendRequest,
  getSentFriendRequests,
  getPendingFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  getFriends,
  blockUser,
  removeFriend,
  cancelFriendRequest,
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

async function getPendingRequestsController(req, res, next) {
  try {
    const userId = req.user.id;
    const pendingRequests = await getPendingFriendRequests(userId);
    res.json(pendingRequests);
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

async function getSentRequestsController(req, res, next) {
  try {
    const userId = req.user.id;
    const sentRequests = await getSentFriendRequests(userId);
    res.json(sentRequests);
  } catch (error) {
    next(error);
  }
}

async function acceptFriendRequestController(req, res, next) {
  try {
    const friendshipId = req.params.friendshipId;
    const userId = req.user.id;
    const acceptRequest = await acceptFriendRequest(friendshipId, userId);
    res.status(200).json(acceptRequest);
  } catch (error) {
    next(error);
  }
}

async function declineFriendRequestController(req, res, next) {
  try {
    const friendshipId = req.params.friendshipId;
    const userId = req.user.id;
    const declineRequest = await declineFriendRequest(friendshipId, userId);
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

async function cancelFriendRequestController(req, res, next) {
  try {
    const friendshipId = req.params.friendshipId;
    const userId = req.user.id;
    const cancelledRequest = await cancelFriendRequest(friendshipId, userId);
    res.status(200).json(cancelledRequest);
  } catch (error) {
    next(error);
  }
}

export {
  getFriendsController,
  getPendingRequestsController,
  sendFriendRequestController,
  getSentRequestsController,
  acceptFriendRequestController,
  declineFriendRequestController,
  blockUserController,
  removeFriendController,
  cancelFriendRequestController,
};
