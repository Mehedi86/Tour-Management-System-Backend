import AppError from "../../errorHelpers/AppError.js";
import type { IAuthProvider, IUser } from "./user.interface.js"
import { User } from "./user.model.js";
import httpStatus from "http-status-codes"
import bcrypt from "bcryptjs";

const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;

    if (!email) {
        throw new AppError(httpStatus.BAD_REQUEST, "Email is required", "");
    }

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User already exists!!", "")
    }

    const hashedPassword = await bcrypt.hash(password as string, 10);
    const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string };


    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    })

    return user;
}

const getAllUsers = async () => {
    const users = await User.find({});
    const totalUsers = await User.countDocuments();

    return {
        data: users,
        meta: {
            total: totalUsers
        }
    }
}

export const userServices = {
    createUser,
    getAllUsers
}