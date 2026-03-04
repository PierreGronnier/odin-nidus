import { register } from "../services/auth.service.js";

async function registerController(req, res, next) {
  try {
    const { username, email, password } = req.body;
    const user = await register(email, username, password);
    res.status(201).json({ message: "Account created successfully", user });
  } catch (error) {
    next(error);
  }
}

export { registerController };
