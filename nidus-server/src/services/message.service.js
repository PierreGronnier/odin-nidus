import prisma from "../config/prisma.js";

async function getMessages(conversationId) {
  return await prisma.message.findMany({
    where: { conversationId },
    orderBy: {
      createdAt: "asc",
    },
  });
}

async function createMessage(data) {
  return await prisma.message.create({
    data,
  });
}

async function updateMessage(id, data) {
  return await prisma.message.update({
    where: { id },
    data,
  });
}

async function deleteMessage(id) {
  return await prisma.message.delete({
    where: { id },
  });
}

export { getMessages, createMessage, updateMessage, deleteMessage };
