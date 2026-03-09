import { z } from "zod";

const createConversationSchema = z
  .object({
    isGroup: z.boolean(),
    name: z.string().min(1).optional(),
    avatarUrl: z.string().url().optional(),
    participantIds: z.array(z.string()).min(1),
  })
  .refine((data) => !data.isGroup || data.name, {
    message: "Group conversations must have a name",
  });

const updateConversationSchema = z
  .object({
    name: z.string().min(1).optional(),
    avatarUrl: z.string().url().optional(),
  })
  .refine((data) => data.name !== undefined || data.avatarUrl !== undefined, {
    message: "At least one field must be provided",
  });

function createConversationValidator(req, res, next) {
  const result = createConversationSchema.safeParse(req.body);
  if (!result.success)
    return res.status(400).json({ errors: result.error.errors });
  next();
}

function updateConversationValidator(req, res, next) {
  const result = updateConversationSchema.safeParse(req.body);
  if (!result.success)
    return res.status(400).json({ errors: result.error.errors });
  next();
}

export { createConversationValidator, updateConversationValidator };
