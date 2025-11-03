import { Router } from "express";
import {
  createChatController,
  getChatByIdController,
  getUserChatsController,
} from "../controllers/chat.controller";
import { passportAuthenticateJwt } from "../config/passport.config";

const ChatRouter = Router()
  .use(passportAuthenticateJwt)
  .post("/create", createChatController)
  .get("/all", getUserChatsController)
  .get("/:id", getChatByIdController);

export default ChatRouter;
