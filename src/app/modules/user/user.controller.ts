import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes"
import { userServices } from "./user.service.js";
import catchAsync from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import AppError from "../../errorHelpers/AppError.js";
import type { JwtPayload } from "jsonwebtoken";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const user = await userServices.createUser(req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User created successfully!!",
        data: user
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const verifiedToken = req.user;
    const payload = req.body;

    if (!userId || typeof userId !== "string") {
        throw new AppError(httpStatus.UNAUTHORIZED, "No userId provided", "");
    }

    const user = await userServices.updateUser(userId, payload, verifiedToken as JwtPayload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User updated successfully!!",
        data: user
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const query = req.query;
    const result = await userServices.getAllUsers(query as Record<string, string>);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All users retrived successfully!!",
        data: result.data,
        meta: result.meta
    })
})

export const userControllers = {
    createUser,
    updateUser,
    getAllUsers
}