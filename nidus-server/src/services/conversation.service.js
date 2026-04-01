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

async function updateConversation(id, data) {
  return await prisma.conversation.update({ where: { id }, data });
}

export {
  getConversationById,
  getUserConversations,
  createConversation,
  updateConversation,
};
