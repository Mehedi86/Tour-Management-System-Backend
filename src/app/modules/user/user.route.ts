import { Router } from "express";
import { userControllers } from "./user.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { createUserZodSchema } from "./user.validation.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { Role } from "./user.interface.js";
// import { Role } from "./user.interface.js";


const router = Router();



router.post("/register", validateRequest(createUserZodSchema), userControllers.createUser);
router.get("/all-users", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), userControllers.getAllUsers);

export const userRoutes = router;