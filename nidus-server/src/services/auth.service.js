import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import { findUserByEmail, findUserByUsername } from "./user.service.js";

async function register(email, username, password) {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    const error = new Error("Email already in use");
    error.status = 409;
    throw error;
  }

  const existingUsername = await findUserByUsername(username);
  if (existingUsername) {
    const error = new Error("Username already in use");
    error.status = 409;
    throw error;
  }

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

async function logout(userId) {
  await prisma.user.update({
    where: { id: userId },
    data: { lastSeenAt: new Date() },
  });
}

export { register, login, logout };
