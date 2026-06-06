/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError.js";
import { BOOKING_STATUS } from "../booking/booking.interface.js";
import { Booking } from "../booking/booking.model.js";
import type { ISSLCommerz } from "../sslCommerz/sslCommerz.interface.js";
import { SSLService } from "../sslCommerz/sslCommerz.service.js";
import { PAYMENT_STATUS } from "./payment.interface.js";
import { Payment } from "./payment.model.js";
import httpStatus from "http-status-codes";

const initPayment = async (bookingId: string) => {
  const payment = await Payment.findOne({ booking: bookingId });

  if (!payment) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Payment Not Found! You dont have book any tour!",
      "",
    );
  }

  const booking = await Booking.findById(payment.booking);

  const userAddress = (booking?.user as any).address;
  const userEmail = (booking?.user as any).email;
  const userPhoneNumber = (booking?.user as any).phone;
  const userName = (booking?.user as any).name;

  const sslPayload: ISSLCommerz = {
    address: userAddress,
    email: userEmail,
    phoneNumber: userPhoneNumber,
    name: userName,
    amount: payment.amount,
    transactionId: payment.transactionId,
  };

  const sslPayment = await SSLService.sslPaymentInit(sslPayload);

   return {
        paymentUrl: sslPayment.GatewayPageURL
    }
};

const successPayment = async (query: Record<string, string>) => {
  // 1. Initialize Mongoose transaction session
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    // 2. We cast the entire object as Record<string, unknown> to satisfy Mongoose + ESLint
    //    Appending .lean() tells Mongoose to return a plain object matching IPayment
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId } as Record<string, unknown>,
      { status: PAYMENT_STATUS.PAID },
      { runValidators: true, session: session },
    ).lean();

    // 3. Prevent potential null crashes if a bad transactionId arrives
    if (!updatedPayment) {
      throw new Error(
        `Payment transaction not found for ID: ${query.transactionId}`,
      );
    }

    // 4. Update corresponding Booking Status to COMPLETE using the extracted ID
    await Booking.findByIdAndUpdate(
      updatedPayment.booking,
      { status: BOOKING_STATUS.COMPLETE },
      { runValidators: true, session: session },
    );

    // 5. Commit atomic changes to database
    await session.commitTransaction();
    session.endSession();

    return { success: true, message: "Payment Completed Successfully" };
  } catch (error) {
    // 6. Automatically roll back both operations if either one fails
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const failPayment = async (query: Record<string, string>) => {
  // 1. Initialize Mongoose transaction session
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    // 2. We cast the entire object as Record<string, unknown> to satisfy Mongoose + ESLint
    //    Appending .lean() tells Mongoose to return a plain object matching IPayment
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId } as Record<string, unknown>,
      { status: PAYMENT_STATUS.FAILED },
      { runValidators: true, session: session },
    ).lean();

    // 3. Prevent potential null crashes if a bad transactionId arrives
    if (!updatedPayment) {
      throw new Error(
        `Payment transaction not found for ID: ${query.transactionId}`,
      );
    }

    // 4. Update corresponding Booking Status to COMPLETE using the extracted ID
    await Booking.findByIdAndUpdate(
      updatedPayment.booking,
      { status: BOOKING_STATUS.FAILED },
      { runValidators: true, session: session },
    );

    // 5. Commit atomic changes to database
    await session.commitTransaction();
    session.endSession();

    return { success: false, message: "Payment Failed" };
  } catch (error) {
    // 6. Automatically roll back both operations if either one fails
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const cancelPayment = async (query: Record<string, string>) => {
  // 1. Initialize Mongoose transaction session
  const session = await Booking.startSession();
  session.startTransaction();

  try {
    // 2. We cast the entire object as Record<string, unknown> to satisfy Mongoose + ESLint
    //    Appending .lean() tells Mongoose to return a plain object matching IPayment
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId } as Record<string, unknown>,
      { status: PAYMENT_STATUS.CANCELLED },
      { runValidators: true, session: session },
    ).lean();

    // 3. Prevent potential null crashes if a bad transactionId arrives
    if (!updatedPayment) {
      throw new Error(
        `Payment transaction not found for ID: ${query.transactionId}`,
      );
    }

    // 4. Update corresponding Booking Status to COMPLETE using the extracted ID
    await Booking.findByIdAndUpdate(
      updatedPayment.booking,
      { status: BOOKING_STATUS.CANCEL },
      { runValidators: true, session: session },
    );

    // 5. Commit atomic changes to database
    await session.commitTransaction();
    session.endSession();

    return { success: false, message: "Payment Cancelled!" };
  } catch (error) {
    // 6. Automatically roll back both operations if either one fails
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const PaymentService = {
  initPayment,
  successPayment,
  failPayment,
  cancelPayment,
};
