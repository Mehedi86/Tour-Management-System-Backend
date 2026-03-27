import type { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import httpStatus from "http-status-codes";
import { AuthServices } from "./auth.service.js";
import AppError from "../../errorHelpers/AppError.js";
import { setAuthCookie } from "../../utils/setCookie.js";
import { createUserTokens } from "../../utils/userTokens.js";
import { envVars } from "../../config/env.js";
import type { JwtPayload } from "jsonwebtoken";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const credentialsLogin = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body);

    setAuthCookie(res, loginInfo);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User logged in successfully!!",
      data: loginInfo,
    });
  },
);


const getNewAccessToken = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "No refresh token recieved from cookies",
        "",
      );
    }

    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);

    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "New access token retrieved successfully!!",
      data: tokenInfo,
    });
  },
);


const logout = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    })

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    })

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User logged out successfully!!",
      data: null
    });
  },
);

const resetPassword = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {

    const decodedToken = req.user;
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;

    await AuthServices.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload)

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password changed successfully!!",
      data: null
    });
  },
);


const googleCallbackController = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {

    let redirectTo = req.query.state ? req.query.state as string : "";
    if (redirectTo.startsWith("/")) {
      // eslint-disable-next-line no-useless-assignment
      redirectTo = redirectTo.slice(1);
    }
    const user = req.user;

    console.log("User", user)

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found!!", '')
    }

    const tokenInfo = createUserTokens(user);

    setAuthCookie(res, tokenInfo)

    // sendResponse(res, {
    //   success: true,
    //   statusCode: httpStatus.OK,
    //   message: "Password changed successfully!!",
    //   data: null
    // });
    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
  }
);

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  googleCallbackController
};
