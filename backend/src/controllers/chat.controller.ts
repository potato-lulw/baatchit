import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTP_STATUS_CODE } from "../config/http.config";
import { chatIdSchema, createChatSchema } from "../validators/chat.validator";
import {
  createChatService,
  getChatByIdService,
  getUserChatsService,
} from "../services/chat.service";

export const createChatController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = createChatSchema.parse(req.body);
    const userId = req.user?._id;
    const chat = await createChatService({
      userId,
      ...body,
    });
    res
      .status(HTTP_STATUS_CODE.OK)
      .json({ message: "Chat created or retrieved successfully", chat });
  },
);

export const getUserChatsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const chat = await getUserChatsService(userId);
    res
      .status(HTTP_STATUS_CODE.OK)
      .json({ message: "Chats retrieved successfully", chat });
  },
);

export const getChatByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = chatIdSchema.parse(req.params);
    const userId = req.user?._id;
    const { chat, messages } = await getChatByIdService(id, userId);
    res
      .status(HTTP_STATUS_CODE.OK)
      .json({ message: "Chat retrieved successfully", chat, messages });
  },
);
