import { Router } from "express";
import { userRoutes } from "../modules/user/user.route.js";
import { AuthRoute } from "../modules/auth/auth.route.js";
import { DivisionRoutes } from "../modules/division/division.route.js";
import { TourRoutes } from "../modules/tour/tour.route.js";
import { BookingRoutes } from "../modules/booking/booking.route.js";
import { paymentRoutes } from "../modules/payment/payment.route.js";

export const router = Router();

const moduleRoutes = [
    {
        path: "/user",
        route: userRoutes
    },
    {
        path: "/auth",
        route: AuthRoute
    },
    {
        path: "/division",
        route: DivisionRoutes
    },
    {
        path: "/tour",
        route: TourRoutes
    },
    {
        path: "/booking",
        route: BookingRoutes
    },
    {
        path: "/payment",
        route: paymentRoutes
    }
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})