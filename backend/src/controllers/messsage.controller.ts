import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTP_STATUS_CODE } from "../config/http.config";
import {
  getMessageByChatIdSchema,
  sendMessageSchema,
} from "../validators/message.validator";
import {
  sendMessageService,
  getMessageByChatIdService,
} from "../services/message.service";

export const sendMessageController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = sendMessageSchema.parse(req.body);
    const userId = req.user?._id;
    const { message, existingChat } = await sendMessageService(body, userId);

    res.status(HTTP_STATUS_CODE.CREATED).json({
      message: "Message sent successfully",
      data: {
        chat: existingChat,
        message: message,
      },
    });
  },
);

export const getMessageByChatIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = getMessageByChatIdSchema.parse(req.params);
    const messages = await getMessageByChatIdService(id);

    res.status(HTTP_STATUS_CODE.OK).json({
      message: "Messages retrieved successfully",
      data: messages,
    });
  },
);
