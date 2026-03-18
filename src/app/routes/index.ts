import { Router } from "express";
import { userRoutes } from "../modules/user/user.route.js";
import { AuthRoute } from "../modules/auth/auth.route.js";

export const router = Router();

const moduleRoutes = [
    {
        path: "/user",
        route: userRoutes
    },
    {
        path: "/auth",
        route: AuthRoute
    }
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})