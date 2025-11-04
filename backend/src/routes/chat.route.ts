import { Router } from "express";
import {
  createChatController,
  getChatByIdController,
  getUserChatsController,
} from "../controllers/chat.controller";
import { passportAuthenticateJwt } from "../config/passport.config";
import {
  getMessageByChatIdController,
  sendMessageController,
} from "../controllers/messsage.controller";

const ChatRouter = Router()
  .use(passportAuthenticateJwt)
  .post("/create", createChatController)
  .post("/message/send", sendMessageController)
  .get("/message/:id", getMessageByChatIdController)
  .get("/all", getUserChatsController)
  .get("/:id", getChatByIdController);

export default ChatRouter;
