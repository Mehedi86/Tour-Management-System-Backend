import { Router, type NextFunction, type Request, type Response } from "express";
import { userControllers } from "./user.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { createUserZodSchema } from "./user.validation.js";
import jwt, { type JwtPayload } from "jsonwebtoken"
import AppError from "../../errorHelpers/AppError.js";
import { Role } from "./user.interface.js";
import { verifyToken } from "../../utils/jwt.js";
import { envVars } from "../../config/env.js";


const router = Router();

const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization;
        if (!accessToken) {
            throw new AppError(403, "No token received", "")
        }

        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET,)

        // if (!verifiedToken) {
        //     console.log(verifiedToken)
        //     throw new AppError(403, `You are not authorized!! ${verifiedToken}`, "")
        // }

        if ((verifiedToken as JwtPayload).role !== Role.ADMIN) {
            throw new AppError(403, "You are not permitted for this route!!", "")
        }
        next()
    } catch (error) {
        next(error);
    }
}

router.post("/register", validateRequest(createUserZodSchema), userControllers.createUser);
router.get("/all-users", checkAuth("ADMIN", "SUPER_ADMIN"), userControllers.getAllUsers);

export const userRoutes = router;