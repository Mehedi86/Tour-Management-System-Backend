import { BOOKING_STATUS } from "../booking/booking.interface.js";
import { Booking } from "../booking/booking.model.js";
import { PAYMENT_STATUS } from "./payment.interface.js";
import { Payment } from "./payment.model.js";

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
      { new: true, runValidators: true, session: session }
    ).lean();

    // 3. Prevent potential null crashes if a bad transactionId arrives
    if (!updatedPayment) {
      throw new Error(`Payment transaction not found for ID: ${query.transactionId}`);
    }

    // 4. Update corresponding Booking Status to COMPLETE using the extracted ID
    await Booking.findByIdAndUpdate(
      updatedPayment.booking,
      { status: BOOKING_STATUS.COMPLETE },
      { new: true, runValidators: true, session: session }
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

const failPayment = async () => {};
const cancelPayment = async () => {};

export const PaymentService = {
  successPayment,
  failPayment,
  cancelPayment,
};