import { z } from "zod";

const messageSchema = z
  .object({
    content: z.string().min(1).optional(),
    imageUrl: z.string().url().optional(),
  })
  .refine((data) => data.content !== undefined || data.imageUrl !== undefined, {
    message: "Message must have content or image",
  });

function messageValidator(req, res, next) {
  const result = messageSchema.safeParse(req.body);
  if (!result.success)
    return res.status(400).json({ errors: result.error.errors });
  next();
}

export { messageValidator };
