/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError.js";
import { User } from "../user/user.model.js"
import { BOOKING_STATUS, type IBooking } from "./booking.interface.js"
import httpStatus from "http-status-codes"
import { Booking } from "./booking.model.js";
import { Payment } from "../payment/payment.model.js";
import { PAYMENT_STATUS } from "../payment/payment.interface.js";
import { Tour } from "../tour/tour.model.js";
import { SSLService } from "../sslCommerz/sslCommerz.service.js";
import type { ISSLCommerz } from "../sslCommerz/sslCommerz.interface.js";

const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};


const createBooking = async (payload: Partial<IBooking>, userId: string) => {

    const transactionId = getTransactionId();

    console.log(payload)

    const session = await Booking.startSession();
    session.startTransaction();

    try {
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

        const booking = await Booking.create([{
            user: userId,
            status: BOOKING_STATUS.PENDING,
            ...payload
        }], { session })

        const bookingDoc = booking[0];

        if (!bookingDoc) {
            throw new Error("Booking creation failed");
        }

        const payment = await Payment.create([{
            booking: bookingDoc._id,
            status: PAYMENT_STATUS.UNPAID,
            transactionId: transactionId,
            amount
        }], { session });

        const paymentDoc = payment[0];

        if (!paymentDoc) {
            throw new Error("Payment creation failed");
        }

        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingDoc._id,
            { payment: paymentDoc._id },
            { returnDocument: "after", runValidators: true, session }
        )
            .populate("user", "name email phone address")
            .populate("tour", "title costFrom")
            .populate("payment")

        const userAddress = (updatedBooking?.user as any).address
        const userEmail = (updatedBooking?.user as any).email
        const userPhoneNumber = (updatedBooking?.user as any).phone
        const userName = (updatedBooking?.user as any).name

        const sslPayload: ISSLCommerz = {
            address: userAddress,
            email: userEmail,
            phoneNumber: userPhoneNumber,
            name: userName,
            amount: amount,
            transactionId: transactionId
        }

        const sslPayment = await SSLService.sslPaymentInit(sslPayload);

        await session.commitTransaction();
        session.endSession();

        return {
            paymentUrl: sslPayment.GatewayPageURL,
            booking: updatedBooking
        }

    }
    catch (error) {

        await session.abortTransaction();
        session.endSession();

        throw error;
    }

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
