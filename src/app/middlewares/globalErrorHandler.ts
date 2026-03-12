import type { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env.js"

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const globalErrorHandler = ((err: any, req: Request, res: Response, next: NextFunction) => {

    const statusCode = 5000;
    const message = `Something went wrong!! ${err} comes form global error handler`;

    res.status(statusCode).json({
        success: false,
        message,
        err,
        stack: envVars.NODE_ENV === "development" ? err.stack : null
    })
})
