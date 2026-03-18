import AppError from "../../errorHelpers/AppError.js";
import type { IUser } from "../user/user.interface.js"
import { User } from "../user/user.model.js";
import httpStatus from "http-status-codes"
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken"
import { generateToken } from "../../utils/jwt.js";
import { envVars } from "../../config/env.js";

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

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const accessToken = generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES);
    
    return {
        accessToken
    }
}

export const AuthServices = {
    credentialsLogin
}