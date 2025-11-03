import { Router } from "express";
import { getAllUsersController } from "../controllers/user.controller";
import { passportAuthenticateJwt } from "../config/passport.config";

const UserRouter = Router()
  .use(passportAuthenticateJwt)
  .get("/all", getAllUsersController);

export default UserRouter;
