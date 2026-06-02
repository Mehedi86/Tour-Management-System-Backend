import AppError from "../../errorHelpers/AppError.js";
import { Role, type IAuthProvider, type IUser } from "./user.interface.js"
import { User } from "./user.model.js";
import httpStatus from "http-status-codes"
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env.js";
import type { JwtPayload } from "jsonwebtoken";
import { QueryBuilder } from "../../utils/QueryBuilder.js";
import { userSearchableFields } from "./user.constant.js";

const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;

    if (!email) {
        throw new AppError(httpStatus.BAD_REQUEST, "Email is required", "");
    }

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User already exists!!", "")
    }

    const hashedPassword = await bcrypt.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND));
    const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string };


    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    })

    return user;
}

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    const isUserExist = await User.findById(userId);

    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found", "");
    }

    /**
        * email - can not update
        * name, phone, password address
        * password - re hashing
        *  only admin superadmin - role, isDeleted...
        * promoting to superadmin - superadmin
        */

    if (payload.email) {
        throw new AppError(httpStatus.BAD_REQUEST, "Email cannot be updated", "");
    }

    if (payload.role) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!!", "")
        }

        if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized!!", "")
        }
    }

    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized", "");
        }
    }

    if (payload.password) {
        payload.password = await bcrypt.hash(payload.password, Number(envVars.BCRYPT_SALT_ROUND))
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })

    return newUpdatedUser;
}


const getAllUsers = async (query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(User.find(), query);

    const users = queryBuilder
        .search(userSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate()

    const [data, meta] = await Promise.all([
        users.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }
}

const getSingleUser = async (id: string) => {
    const user = await User.findById(id);
    return {
        data: user
    }
};

export const UserServices = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser
}