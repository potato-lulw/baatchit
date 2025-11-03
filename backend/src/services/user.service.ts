import User from "../models/user.model";

export const findByIdUserService = async (id: string) => {
  return await User.findById(id);
};

export const getUsersService = async (userId: string) => {
  return await User.find({ _id: { $ne: userId } }).select("-password");
};
