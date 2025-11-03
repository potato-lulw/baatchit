import { Router } from "express";
import AuthRouter from "./auth.route";

const routes = Router();
routes.use('/auth', AuthRouter);

export default routes;
