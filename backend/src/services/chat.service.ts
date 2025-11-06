import { emitNewChatToParticipants } from "../lib/sockets";
import Chat from "../models/chat.model";
import Message from "../models/message.model";
import User from "../models/user.model";
import { BadRequestError, NotFoundError } from "../utils/app-error";

type createChatType = {
  userId: string;
  participants?: string[];
  isGroup?: boolean;
  participantId?: string;
  groupName?: string;
};
export const createChatService = async (body: createChatType) => {
  let chat;
  let allParticipants: string[] = [];
  const { userId, participants, isGroup, participantId, groupName } = body;
  if (isGroup && participants?.length && groupName) {
    allParticipants = [...participants, userId];
    chat = await Chat.create({
      groupName: groupName,
      isGroupChat: true,
      participants: allParticipants,
      createdBy: userId,
    });
  } else if (participantId) {
    const participant = await User.findById(participantId);
    if (!participant) throw new NotFoundError("Participant not found");
    allParticipants = [participantId, userId];

    const existingChat = await Chat.findOne({
      participants: { $all: allParticipants },
    }).populate("participants", "name avatar");
    if (existingChat) return existingChat;
    chat = await Chat.create({
      participants: allParticipants,
      createdBy: userId,
    });
  }

  // implement sockets
  const populatedChat = await chat?.populate("participants", "name avatar");
  const participantIdString = populatedChat?.participants.map((participant) =>
    participant._id.toString(),
  );

  emitNewChatToParticipants(participantIdString, populatedChat);

  return chat;
};

export const getUserChatsService = async (userId: string) => {
  const chats = await Chat.find({ participants: { $in: [userId] } })
    .populate("participants", "name avatar")
    .populate({
      path: "lastMessage",
      populate: {
        path: "sender",
        select: "name avatar",
      },
    })
    .sort({ updatedAt: -1 });

  return chats;
};

export const getChatByIdService = async (chatId: string, userId: string) => {
  const chat = await Chat.findOne({
    _id: chatId,
    participants: { $in: [userId] },
  }).populate("participants", "name avatar");

  if (!chat) throw new NotFoundError("Chat not found");

  const messages = await Message.find({
    chatId: chat._id,
  })
    .populate("sender", "name avatar")
    .populate({
      path: "replyTo",
      populate: {
        path: "sender",
        select: "name avatar",
      },
      select: "content image sender",
    })
    .sort({ createdAt: -1 });

  return {
    chat,
    messages,
  };
};

export const validateChatParticipants = async (
  chatId: string,
  userId: string,
) => {
  const chat = await Chat.findOne({
    _id: chatId,
    participants: { $in: [userId] },
  });

  if (!chat)
    throw new BadRequestError("You are not a participant of this chat");
};
