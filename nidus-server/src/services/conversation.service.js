import prisma from "../config/prisma.js";

async function getConversationById(id) {
  return await prisma.conversation.findUnique({ where: { id } });
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
      const error = new Error("A DM already exists with this user");
      error.status = 409;
      throw error;
    }
  }
  return await prisma.conversation.create({
    data: {
      ...data,
      participants: {
        create: participantIds.map((userId) => ({ userId })),
      },
    },
  });
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
