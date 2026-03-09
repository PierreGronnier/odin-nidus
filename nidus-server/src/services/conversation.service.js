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
