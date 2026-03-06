import { register, login, logout } from "../services/auth.service.js";
import jwt from "jsonwebtoken";

async function registerController(req, res, next) {
  try {
    const { username, email, password } = req.body;
    const user = await register(email, username, password);
    const { passwordHash, ...safeUser } = user;
    res.status(201).json({ message: "Account created successfully", safeUser });
  } catch (error) {
    next(error);
  }
}

async function loginController(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await login(email, password);
    const { passwordHash, ...safeUser } = user;
    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      },
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res
      .status(200)
      .json({ message: "You are now logged in", accessToken, safeUser });
  } catch (error) {
    next(error);
  }
}

async function logoutController(req, res, next) {
  try {
    await logout(req.user.id);
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
}

async function refreshController(req, res, next) {
  try {
    const rftoken = req.cookies.refreshToken;
    const decoded = jwt.verify(rftoken, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
}

export {
  registerController,
  loginController,
  logoutController,
  refreshController,
};
