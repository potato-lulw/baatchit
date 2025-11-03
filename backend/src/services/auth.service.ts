import User from "../models/user.model";
import { NotFoundError, UnauthorizedError } from "../utils/app-error";
import { LoginSchemaType, RegisterSchemaType } from "../validators/auth.validator";


export const registerService = async (body: RegisterSchemaType) => {

    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
        throw new UnauthorizedError("User already exists");
    }
    const user = await User.create(body);
    return user;
}

export const loginService = async (body: LoginSchemaType) => {

    const user = await User.findOne({ email: body.email });
    if (!user) {
        throw new NotFoundError("User not found");
    }
    const isValid = await user.comparePassword(body.password);
    if (!isValid) {
        throw new UnauthorizedError("Invalid credentials");
    }
    return user;
}