import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function registerValidator(req, res, next) {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }

  next();
}

export { registerValidator };
