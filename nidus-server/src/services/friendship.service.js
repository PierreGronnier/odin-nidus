import { FriendshipStatus } from "@prisma/client";
import prisma from "../config/prisma.js";

async function getFriends(userId) {
  return await prisma.friendship.findMany({
    where: {
      status: FriendshipStatus.ACCEPTED,
      OR: [{ requesterId: userId }, { receiverId: userId }],
    },
  });
}

async function sendFriendRequest(requesterId, receiverId) {
  return await prisma.friendship.create({
    data: {
      requesterId,
      receiverId,
      status: FriendshipStatus.PENDING,
    },
  });
}

async function acceptFriendRequest(friendshipId) {
  return await prisma.friendship.update({
    where: { id: friendshipId },
    data: { status: FriendshipStatus.ACCEPTED },
  });
}

async function declineFriendRequest(friendshipId) {
  return await prisma.friendship.update({
    where: { id: friendshipId },
    data: { status: FriendshipStatus.DECLINED },
  });
}

async function blockUser(friendshipId) {
  return await prisma.friendship.update({
    where: { id: friendshipId },
    data: { status: FriendshipStatus.BLOCKED },
  });
}

async function removeFriend(friendshipId) {
  return await prisma.friendship.delete({
    where: { id: friendshipId },
  });
}

export {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  getFriends,
  blockUser,
  removeFriend,
};
