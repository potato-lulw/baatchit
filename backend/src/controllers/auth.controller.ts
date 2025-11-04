import express, { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import { loginService, registerService } from "../services/auth.service";
import { clearJwtAuthCookie, setJwtAuthCookie } from "../utils/cookie";
import { HTTP_STATUS_CODE } from "../config/http.config";

export const registerController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse(req.body);
    const user = await registerService(body);

    const userId = user._id as string;

    return setJwtAuthCookie({ res, userId })
      .status(HTTP_STATUS_CODE.CREATED)
      .json({ message: "User registered successfully.", data: user });
  },
);

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = loginSchema.parse(req.body);
    const user = await loginService(body);

    const userId = user._id as string;

    return setJwtAuthCookie({ res, userId })
      .status(HTTP_STATUS_CODE.OK)
      .json({ message: "User registered successfully.", data: user });
  },
);

export const logoutController = asyncHandler(
  async (req: Request, res: Response) => {
    return clearJwtAuthCookie(res)
      .status(HTTP_STATUS_CODE.OK)
      .json({ message: "User logged outsuccessfully." });
  },
);

export const authStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;

    return res
      .status(HTTP_STATUS_CODE.OK)
      .json({ message: "Authenticated user successfully.", data: user });
  },
);
