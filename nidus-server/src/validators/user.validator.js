import { z } from "zod";

const updateUserSchema = z
  .object({
    bio: z.string().max(200).optional(),
    avatarUrl: z.string().url().optional(),
  })
  .refine((data) => data.bio !== undefined || data.avatarUrl !== undefined, {
    message: "At least one field must be provided",
  });

function updateUserValidator(req, res, next) {
  const result = updateUserSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }

  next();
}

export { updateUserValidator };
