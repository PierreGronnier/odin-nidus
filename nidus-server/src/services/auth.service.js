import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import { findUserByEmail } from "./user.service.js";

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

async function login(email, password) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  return user;
}

export { register, login };
