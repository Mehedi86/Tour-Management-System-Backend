/* eslint-disable @typescript-eslint/no-unused-vars */
import type mongoose from "mongoose"
import type { TGenericErrorResponse } from "../interfaces/error.type.js"

export const handleCastError = (err: mongoose.Error.CastError): TGenericErrorResponse => {
    return {
        statusCode: 400,
        message: "Invalid Mongodb objectId, please provide a valid ID"
    }
}