import prisma from "../config/prisma.js";

async function findUserByEmail(email) {
  return await prisma.user.findUnique({ where: { email } });
}

async function findUserByUsername(username) {
  return await prisma.user.findUnique({ where: { username } });
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

async function findUserByGoogleId(googleId) {
  return await prisma.user.findUnique({
    where: { googleId },
  });
}

export {
  findUserById,
  findUserByEmail,
  findUserByUsername,
  updateUser,
  searchUsers,
  findUserByGoogleId,
};
