import type { NextFunction, Request, Response } from "express";

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// alternative of try catch to avoid repeatative try catch writings
const catchAsync = (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err: unknown) => {
        console.log(err);
        next(err);
    })
}

export default catchAsync;