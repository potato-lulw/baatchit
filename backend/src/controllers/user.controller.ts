import { HTTP_STATUS_CODE } from "../config/http.config";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { getUsersService } from "../services/user.service";

export const getAllUsersController = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  console.log(userId);
  const users = await getUsersService(userId);
  res
    .status(HTTP_STATUS_CODE.OK)
    .json({ message: "Users fetched successfully", users });
});
