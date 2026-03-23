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

async function getPendingFriendRequests(userId) {
  return await prisma.friendship.findMany({
    where: {
      receiverId: userId,
      status: FriendshipStatus.PENDING,
    },
    include: {
      requester: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
  });
}

async function sendFriendRequest(requesterId, receiverId) {
  if (requesterId === receiverId) {
    const error = new Error("You can't send a friend request to yourself");
    error.status = 400;
    throw error;
  }

  // Vérifier si une demande ACCEPTED existe déjà
  const existingAccepted = await prisma.friendship.findFirst({
    where: {
      status: FriendshipStatus.ACCEPTED,
      OR: [
        { requesterId, receiverId },
        { requesterId: receiverId, receiverId: requesterId },
      ],
    },
  });

  if (existingAccepted) {
    const error = new Error("You are already friends with this user");
    error.status = 409;
    throw error;
  }

  // Vérifier si une demande PENDING existe
  const existingPending = await prisma.friendship.findFirst({
    where: {
      status: FriendshipStatus.PENDING,
      OR: [
        { requesterId, receiverId },
        { requesterId: receiverId, receiverId: requesterId },
      ],
    },
  });

  if (existingPending) {
    const error = new Error("A friend request is already pending");
    error.status = 409;
    throw error;
  }

  // Si une demande DECLINED existe, on la supprime
  const existingDeclined = await prisma.friendship.findFirst({
    where: {
      status: FriendshipStatus.DECLINED,
      OR: [
        { requesterId, receiverId },
        { requesterId: receiverId, receiverId: requesterId },
      ],
    },
  });

  if (existingDeclined) {
    await prisma.friendship.delete({
      where: { id: existingDeclined.id },
    });
  }

  return await prisma.friendship.create({
    data: {
      requesterId,
      receiverId,
      status: FriendshipStatus.PENDING,
    },
  });
}

async function getSentFriendRequests(userId) {
  return await prisma.friendship.findMany({
    where: {
      requesterId: userId,
      status: FriendshipStatus.PENDING,
    },
    include: {
      receiver: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
  });
}

async function acceptFriendRequest(friendshipId, userId) {
  const friendship = await prisma.friendship.findUnique({
    where: { id: friendshipId },
  });

  if (!friendship) {
    const error = new Error("Friend request not found");
    error.status = 404;
    throw error;
  }

  if (friendship.receiverId !== userId) {
    const error = new Error("You are not authorized to accept this request");
    error.status = 403;
    throw error;
  }

  if (friendship.status !== FriendshipStatus.PENDING) {
    const error = new Error("This friend request has already been processed");
    error.status = 400;
    throw error;
  }

  return await prisma.friendship.update({
    where: { id: friendshipId },
    data: { status: FriendshipStatus.ACCEPTED },
  });
}

async function declineFriendRequest(friendshipId, userId) {
  const friendship = await prisma.friendship.findUnique({
    where: { id: friendshipId },
  });

  if (!friendship) {
    const error = new Error("Friend request not found");
    error.status = 404;
    throw error;
  }

  if (friendship.receiverId !== userId) {
    const error = new Error("You are not authorized to decline this request");
    error.status = 403;
    throw error;
  }

  if (friendship.status !== FriendshipStatus.PENDING) {
    const error = new Error("This friend request has already been processed");
    error.status = 400;
    throw error;
  }

  return await prisma.friendship.update({
    where: { id: friendshipId },
    data: { status: FriendshipStatus.DECLINED },
  });
}

async function blockUser(friendshipId) {
  const friendship = await prisma.friendship.findUnique({
    where: { id: friendshipId },
  });

  if (!friendship) {
    const error = new Error("Friend request not found");
    error.status = 404;
    throw error;
  }

  return await prisma.friendship.update({
    where: { id: friendshipId },
    data: { status: FriendshipStatus.BLOCKED },
  });
}

async function removeFriend(friendshipId) {
  const friendship = await prisma.friendship.findUnique({
    where: { id: friendshipId },
  });

  if (!friendship) {
    const error = new Error("Friend request not found");
    error.status = 404;
    throw error;
  }

  return await prisma.friendship.delete({
    where: { id: friendshipId },
  });
}

async function cancelFriendRequest(friendshipId, userId) {
  const friendship = await prisma.friendship.findUnique({
    where: { id: friendshipId },
  });

  if (!friendship) {
    const error = new Error("Friend request not found");
    error.status = 404;
    throw error;
  }

  if (friendship.requesterId !== userId) {
    const error = new Error("You can only cancel your own requests");
    error.status = 403;
    throw error;
  }

  if (friendship.status !== FriendshipStatus.PENDING) {
    const error = new Error("Cannot cancel a request that has been processed");
    error.status = 400;
    throw error;
  }

  return await prisma.friendship.delete({
    where: { id: friendshipId },
  });
}

export {
  sendFriendRequest,
  getSentFriendRequests,
  getPendingFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  getFriends,
  blockUser,
  removeFriend,
  cancelFriendRequest,
};
