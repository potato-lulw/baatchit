import { Router } from "express";
import AuthRouter from "./auth.route";
import ChatRouter from "./chat.route";
import UserRouter from "./user.route";

const routes = Router();
routes.use("/auth", AuthRouter);
routes.use("/chat", ChatRouter);
routes.use("/user", UserRouter);

export default routes;
