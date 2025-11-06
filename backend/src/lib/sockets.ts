import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { Env } from "../config/env.config";

import { UnauthorizedError } from "../utils/app-error";
import jwt from "jsonwebtoken";
import Chat from "../models/chat.model";
import { validateChatParticipants } from "../services/chat.service";
import { emit } from "process";

let io: Server | null = null;

const onlineUsers = new Map<string, string>();

interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export const initializeSockets = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: Env.FRONTEND_URL,
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });

  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const rawCookie = socket.handshake.headers.cookie;
      if (!rawCookie)
        return next(new UnauthorizedError("Authentication failed"));

      const token = rawCookie.split("=")[1].trim();
      if (!token) return next(new UnauthorizedError("Authentication failed"));

      const decodedToken = jwt.verify(token, Env.JWT_SECRET) as {
        userId: string;
      };
      if (!decodedToken)
        return next(new UnauthorizedError("Authentication failed"));

      socket.userId = decodedToken.userId;
      next();
    } catch (error) {
      console.error(error);
      next(new UnauthorizedError("Authentication failed"));
    }
  });

  io.on("connection", (socket: AuthenticatedSocket) => {
    if (!socket.userId) {
      socket.disconnect(true);
      return;
    }
    const userId = socket.userId;
    const socketId = socket.id;
    console.log(
      "New client connected with userId:",
      userId,
      "and socketId:",
      socketId,
    );

    // add user to onlineUsers map
    onlineUsers.set(userId, socketId);

    // emit online users list
    io?.emit("online:users", Array.from(onlineUsers.keys()));

    socket.join(`user:${userId}`);

    socket.on(
      "chat:join",
      async (chatId: string, callback?: (err?: string) => void) => {
        try {
          // check if current user is a member of the provided chatId
          await validateChatParticipants(chatId, userId);

          socket.join(`chat:${chatId}`);
          callback?.();
        } catch (error) {
          console.error(error);
          callback?.("An error occurred");
        }
      },
    );
    socket.on("chat:leave", (chatId: string) => {
      socket.leave(`chat:${chatId}`);
      console.log(`User ${userId} left chat ${chatId}`);
    });

    socket.on("disconnect", () => {
      if (onlineUsers.get(userId) == socketId) {
        if (userId) onlineUsers.delete(userId);
        io?.emit("online:users", Array.from(onlineUsers.keys()));
        console.log(`User ${userId} disconnected`);
      }
    });
  });
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io instance not initialized");
  }
  return io;
};

export const emitNewChatToParticipants = async (
  participantIdString: string[] = [],
  chat: any,
) => {
  const io = getIO();
  participantIdString.forEach((participantId) => {
    io.to(`user:${participantId}`).emit("chat:new", chat);
  });
};

export const emitNewMessageToChatRoom = async (
  userId: string,
  chatId: string,
  message: any,
) => {
  const io = getIO();
  const senderSocketId = onlineUsers.get(userId);
  if (senderSocketId) {
    io.to(`chat:${chatId}`).except(senderSocketId).emit("message:new", message);
  } else {
    io.to(`chat:${chatId}`).emit("message:new", message);
  }
};

export const emitLastMessageToParticipants = async (
  participantIdString: string[] = [],
  chatId: string,
  message: any,
) => {
  const io = getIO();
  participantIdString.forEach((participantId) => {
    io.to(`user:${participantId}`).emit("chat:update", { chatId, message });
  });
};
