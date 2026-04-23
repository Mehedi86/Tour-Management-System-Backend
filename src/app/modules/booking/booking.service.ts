import AppError from "../../errorHelpers/AppError.js";
import { User } from "../user/user.model.js"
import { BOOKING_STATUS, type IBooking } from "./booking.interface.js"
import httpStatus from "http-status-codes"
import { Booking } from "./booking.model.js";
import { Payment } from "../payment/payment.model.js";
import { PAYMENT_STATUS } from "../payment/payment.interface.js";
import { Tour } from "../tour/tour.model.js";

const getTransectionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};


const createBooking = async (payload: Partial<IBooking>, userId: string) => {

    const transectionId = getTransectionId();

    const user = await User.findById(userId);

    if (!user?.phone || !user?.address) {
        throw new AppError(httpStatus.BAD_REQUEST, "Please update your profile to Book Tour!!", "")
    }

    const tour = await Tour.findById(payload.tour).select("costFrom");

    if (!tour?.costFrom) {
        throw new AppError(httpStatus.BAD_REQUEST, "No Tour Cost Found!", "")
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const amount = Number(tour.costFrom) * Number(payload.guestCount!)

    const booking = await Booking.create({
        user: userId,
        status: BOOKING_STATUS.PENDING,
        ...payload
    })

    const payment = await Payment.create({
        booking: booking._id,
        status: PAYMENT_STATUS.UNPAID,
        transactionId: transectionId,
        amount: amount
    })

    const updatedBooking = await Booking.findByIdAndUpdate(
        booking._id,
        { payment: payment._id },
        { new: true, runValidators: true }
    )

    return updatedBooking;
}
const getUserBookings = async () => {
    return {}
}
const getBookingById = async () => {
    return {}
}
const getAllBookings = async () => {
    return {}
}
const updateBookingStatus = async () => {
    return {}
}


export const BookingService = {
    createBooking,
    getUserBookings,
    getBookingById,
    getAllBookings,
    updateBookingStatus
}
