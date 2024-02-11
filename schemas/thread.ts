import * as z from "zod";

export const ThreadSchema = z.object({
  id: z.optional(z.string()),
  title: z.string().min(1, {
    message: "Title cannot be empty",
  }),

  content: z.string().min(1, {
    message: "Content cannot be empty",
  }),
  parent_id: z.null(),
  communityId: z.optional(z.string()),
});

const _ThreadChildSchema = z.object({
  title: z.null().optional(),
  parent_id: z.string().min(1, {
    message: "Invalid parent",
  }),
});

export const ThreadChildSchema = ThreadSchema.merge(_ThreadChildSchema);
