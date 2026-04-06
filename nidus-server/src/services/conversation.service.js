import prisma from "../config/prisma.js";

async function getConversationById(id) {
  return await prisma.conversation.findUnique({
    where: { id },
    include: {
      owner: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        },
      },
      participants: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  });
}

async function getUserConversations(userId) {
  return await prisma.conversationParticipant.findMany({
    where: { userId },
    include: { conversation: true },
  });
}

async function createConversation(data, participantIds) {
  if (!data.isGroup) {
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        isGroup: false,
        AND: participantIds.map((userId) => ({
          participants: {
            some: { userId },
          },
        })),
      },
    });

    if (existingConversation) {
      return { conversation: existingConversation, created: false };
    }
  }

  const newConversation = await prisma.conversation.create({
    data: {
      ...data,
      participants: {
        create: participantIds.map((userId) => ({ userId })),
      },
    },
  });
  return { conversation: newConversation, created: true };
}

async function updateConversation(id, userId, data) {
  const group = await prisma.conversation.findUnique({ where: { id } });
  if (!group) {
    const error = new Error("Group not found");
    error.status = 404;
    throw error;
  }
  if (group.ownerId !== userId) {
    const error = new Error("You need to own the group to update it");
    error.status = 403;
    throw error;
  }
  return await prisma.conversation.update({ where: { id }, data });
}

async function deleteConversation(id, userId) {
  const group = await prisma.conversation.findUnique({ where: { id } });
  if (!group) {
    const error = new Error("Group not found");
    error.status = 404;
    throw error;
  }

  if (group.ownerId !== userId) {
    const error = new Error("You need to own the group to delete it");
    error.status = 403;
    throw error;
  }

  return await prisma.conversation.delete({ where: { id } });
}

async function addParticipants(conversationId, userId, participantIds) {
  const group = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });
  if (!group) {
    const error = new Error("Group not found");
    error.status = 404;
    throw error;
  }
  if (group.ownerId !== userId) {
    const error = new Error("You need to own the group to add participants");
    error.status = 403;
    throw error;
  }
  return await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      participants: {
        create: participantIds.map((userId) => ({ userId })),
      },
    },
  });
}

async function removeParticipants(conversationId, userId, participantIds) {
  const group = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      participants: {
        orderBy: { joinedAt: "asc" },
      },
    },
  });

  if (!group) {
    const error = new Error("Group not found");
    error.status = 404;
    throw error;
  }

  const isSelfLeave =
    participantIds.length === 1 && participantIds[0] === userId;

  if (!isSelfLeave && group.ownerId !== userId) {
    const error = new Error("You need to own the group to remove participants");
    error.status = 403;
    throw error;
  }

  if (group.ownerId === userId && isSelfLeave) {
    const nextOwner = group.participants.find((p) => p.userId !== userId);

    if (nextOwner) {
      await prisma.conversation.update({
        where: { id: conversationId },
        data: { ownerId: nextOwner.userId },
      });
    } else {
      return await prisma.conversation.delete({
        where: { id: conversationId },
      });
    }
  }

  return await prisma.conversationParticipant.deleteMany({
    where: {
      conversationId,
      userId: { in: participantIds },
    },
  });
}

export {
  getConversationById,
  getUserConversations,
  createConversation,
  updateConversation,
  deleteConversation,
  addParticipants,
  removeParticipants,
};
