import { z } from "zod";

const updateUserSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be at most 20 characters"),
    bio: z.string().max(200).optional(),
    avatarUrl: z.string().url().optional(),
  })
  .refine(
    (data) =>
      data.bio !== undefined ||
      data.avatarUrl !== undefined ||
      data.username !== undefined,
    {
      message: "At least one field must be provided",
    },
  );

function updateUserValidator(req, res, next) {
  const result = updateUserSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }

  next();
}

export { updateUserValidator };
