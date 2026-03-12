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

async function updateMessage(id, data, userId) {
  const message = await prisma.message.findUnique({ where: { id } });

  if (!message) {
    const error = new Error("Message not found");
    error.status = 404;
    throw error;
  }

  if (message.senderId !== userId) {
    const error = new Error("Unauthorized");
    error.status = 403;
    throw error;
  }

  return await prisma.message.update({ where: { id }, data });
}

async function deleteMessage(id, userId) {
  const message = await prisma.message.findUnique({ where: { id } });

  if (!message) {
    const error = new Error("Message not found");
    error.status = 404;
    throw error;
  }

  if (message.senderId !== userId) {
    const error = new Error("Unauthorized");
    error.status = 403;
    throw error;
  }

  return await prisma.message.delete({ where: { id } });
}

export { getMessages, createMessage, updateMessage, deleteMessage };
