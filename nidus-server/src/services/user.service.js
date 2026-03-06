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

export { findUserById, findUserByEmail, updateUser };
