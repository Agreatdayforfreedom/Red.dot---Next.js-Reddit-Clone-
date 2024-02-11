import * as z from "zod";

export const CommunitySchema = z.object({
  name: z.string().min(1).max(21),
  info: z.string().min(1).max(256),
  background_color: z.string().min(7).max(7),
  background_image: z.optional(z.string()),
  interactive_elements_color: z.string().min(7).max(7),
});
