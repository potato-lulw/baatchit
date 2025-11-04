import { z } from "zod";

export const sendMessageSchema = z
  .object({
    chatId: z.string().trim().min(1),
    content: z.string().trim().min(1).max(1000).optional(),
    image: z.string().trim().optional(),
    replyTo: z.string().trim().optional(),
  })
  .refine((data) => data.content || data.image, {
    message: "Content or image is required",
    path: ["content"],
  });

export const getMessageByChatIdSchema = z.object({
  id: z.string().trim().min(1),
});
