import prisma from "../config/prisma.js";

async function findUserByEmail(email) {
  return await prisma.user.findUnique({ where: { email } });
}

async function findUserById(id) {
  return await prisma.user.findUnique({ where: { id } });
}

async function updateUser(id, data) {
  return await prisma.user.update({
    where: { id },
    data,
  });
}

async function searchUsers(username) {
  return await prisma.user.findMany({
    where: {
      username: {
        contains: username,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      username: true,
      avatarUrl: true,
    },
  });
}

export { findUserById, findUserByEmail, updateUser, searchUsers };
