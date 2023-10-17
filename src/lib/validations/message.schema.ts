import { z } from "zod";

export const SetMessageSchema = z.object({
  code: z.string({ required_error: "Code is required" }),
  language: z.string({ required_error: "Language is required" }),
  category: z.string({ required_error: "Category is required" }),
  content: z.string({ required_error: "Content is required" }),
});

export const UpdateMessageSchema = z.object({
  updatedRow: z.object({
    code: z.string().optional(),
    language: z.string().optional(),
    category: z.string().optional(),
    content: z.string().optional(),
  }),
  originalRow: z.object({
    code: z.string(),
    language: z.string(),
    category: z.string(),
    content: z.string(),
  }),
});

export type SetMessageInput = z.infer<typeof SetMessageSchema>;
export type UpdateMessageInput = z.infer<typeof UpdateMessageSchema>;
