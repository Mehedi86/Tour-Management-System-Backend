import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes"
import { userServices } from "./user.service.js";
import catchAsync from "../../utils/catchAsync.js";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const user = await userServices.createUser(req.body);
    res.status(httpStatus.CREATED).json({
        message: "User created successfully!",
        user
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const users = await userServices.getAllUsers();
    res.status(httpStatus.OK).json({
        success: true,
        message: "All users retrived successfully!!",
        data: users
    })
})

export const userControllers = {
    createUser,
    getAllUsers
}