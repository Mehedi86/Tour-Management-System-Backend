import AppError from "../../errorHelpers/AppError.js";
import type { IUser } from "../user/user.interface.js"
import { User } from "../user/user.model.js";
import httpStatus from "http-status-codes"
import bcrypt from "bcryptjs";

const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload;

    if (!email) {
        throw new AppError(httpStatus.BAD_REQUEST, "Email is required", "");
    }
    const isUserExist = await User.findOne({ email })

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exists!!", "")
    }

    const isPasswordMatched = await bcrypt.compare(password as string, isUserExist.password as string)

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect password!!", "")
    }

    return {
        email: isUserExist.email
    }
}

export const AuthServices = {
    credentialsLogin
}