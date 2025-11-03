import User from "../models/user.model";

export const findByIdUserService = async (id: string) => {
    return await User.findById(id);
}