import { Router } from "express";
import { userControllers } from "./user.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { createUserZodSchema } from "./user.validation.js";


const router = Router();

router.post("/register", validateRequest(createUserZodSchema), userControllers.createUser);
router.get("/all-users", userControllers.getAllUsers);

export const userRoutes = router;