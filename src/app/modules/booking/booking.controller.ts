import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { BookingService } from "./booking.service.js";
import type { JwtPayload } from "jsonwebtoken";


const createBooking = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload
    const booking = await BookingService.createBooking(req.body, decodedToken.userId);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Booking created successfully!",
        data: booking
    })
})

const getUserBookings = catchAsync(async (req: Request, res: Response) => {

    const booking = await BookingService.getUserBookings();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Bookings retrived successfully!",
        data: booking
    })
})

const getSingleBooking = catchAsync(async (req: Request, res: Response) => {

    const booking = await BookingService.getBookingById();

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Booking retrived successfully!",
        data: booking
    })
})

const getAllBookings = catchAsync(async (req: Request, res: Response) => {

    const booking = await BookingService.getAllBookings();

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Bookings retrived successfully!",
        data: booking
    })
})

const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {

    const booking = await BookingService.updateBookingStatus();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Booking status updated successfully!",
        data: booking
    })
})

export const BookingController = {
    createBooking,
    getUserBookings,
    getSingleBooking,
    getAllBookings,
    updateBookingStatus
}



