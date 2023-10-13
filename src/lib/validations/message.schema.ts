import { z } from "zod";

export const SetMessageSchema = z.object({
  code: z.string({ required_error: "Code is required" }),
  language: z.string({ required_error: "Language is required" }),
  category: z.string({ required_error: "Category is required" }),
  content: z.string({ required_error: "Content is required" }),
});

export type SetMessageInput = z.infer<typeof SetMessageSchema>;
