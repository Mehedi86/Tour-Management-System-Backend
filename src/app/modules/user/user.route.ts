import { Router } from "express";
import { UserControllers } from "./user.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { Role } from "./user.interface.js";
// import { Role } from "./user.interface.js";


const router = Router();



router.post("/register", validateRequest(createUserZodSchema), UserControllers.createUser);

router.get("/all-users", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.getAllUsers);

router.get("/:id", checkAuth(...Object.values(Role)), UserControllers.getSingleUser)
router.patch("/:id", validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), UserControllers.updateUser)

export const userRoutes = router;