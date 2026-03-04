import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";

async function register(email, username, password) {
  const passwordHash = await bcrypt.hash(password, 10);

  return await prisma.user.create({
    data: {
      email,
      username,
      passwordHash,
    },
  });
}

export { register };
