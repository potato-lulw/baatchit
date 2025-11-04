import { z } from "zod";
import { sendMessageSchema } from "../validators/message.validator";
import Chat from "../models/chat.model";
import { NotFoundError } from "../utils/app-error";
import Message from "../models/message.model";
import { Cloudinary } from "../config/cloudinary.config";

type SendMessageScemaType = z.infer<typeof sendMessageSchema>;

export const sendMessageService = async (
  body: SendMessageScemaType,
  userId: string,
) => {
  const { chatId, content, replyTo, image } = body;

  const existingChat = await Chat.findOne({
    _id: chatId,
    participants: { $in: [userId] },
  });
  if (!existingChat) throw new NotFoundError("Chat not found");

  if (replyTo) {
    const existingMessage = await Message.findOne({
      _id: replyTo,
      chatId,
    });
    if (!existingMessage) throw new NotFoundError("Message not found");
  }

  let imageUrl;

  if (image) {
    const uploadResult = await Cloudinary.uploader.upload(image, {
      folder: "messages",
    });
    imageUrl = uploadResult.secure_url;
  }

  const message = await Message.create({
    chatId,
    sender: userId,
    content,
    replyTo,
    image: imageUrl,
  });

  await message.populate([
    {
      path: "sender",
      select: "name avatar",
    },
    {
      path: "replyTo",
      select: "content image sender",
      populate: {
        path: "sender",
        select: "name avatar",
      },
    },
  ]);

  // implement websockets

  return { message, existingChat };
};

export const getMessageByChatIdService = async (chatId: string) => {
  const messages = await Message.find({ chatId }).sort({ createdAt: -1 });

  await Promise.all(
    messages.map(async (message) => {
      await message.populate([
        {
          path: "sender",
          select: "name avatar",
        },
        {
          path: "replyTo",
          select: "content image sender",
          populate: {
            path: "sender",
            select: "name avatar",
          },
        },
      ]);
    }),
  );

  return messages;
};
