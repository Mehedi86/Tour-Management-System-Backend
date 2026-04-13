/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../errorHelpers/AppError.js";
// import { type IUser } from "../user/user.interface.js";
import { User } from "../user/user.model.js";
import httpStatus from "http-status-codes";
import bcrypt from "bcryptjs";
import { createNewAccessTokenWithRefreshToken } from "../../utils/userTokens.js";
import type { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env.js";


// const credentialsLogin = async (payload: Partial<IUser>) => {
//   const { email, password } = payload;

//   if (!email) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Email is required", "");
//   }

//   const isUserExist = await User.findOne({ email });

//   if (!isUserExist) {
//     throw new AppError(httpStatus.BAD_REQUEST, "User does not exists!!", "");
//   }

//   const isPasswordMatched = await bcrypt.compare(
//     password as string,
//     isUserExist.password as string,
//   );

//   if (!isPasswordMatched) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Incorrect password!!", "");
//   }

//   const userTokens = createUserTokens(isUserExist);

//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const { password: pass, ...rest } = isUserExist.toObject();

//   return {
//     accessToken: userTokens.accessToken,
//     refreshToken: userTokens.refreshToken,
//     user: rest,
//   };
// };

const getNewAccessToken = async (refreshToken: string) => {

  const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken);

  return {
    accessToken: newAccessToken
  };
};

const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {

  const user = await User.findById(decodedToken.userId);

  const isOldPasswordMatch = await bcrypt.compare(oldPassword, user!.password as string);

  if (!isOldPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old password does not match!!", "");
  }

  user!.password = await bcrypt.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));

  user!.save();
};

export const AuthServices = {
  getNewAccessToken,
  resetPassword
};
