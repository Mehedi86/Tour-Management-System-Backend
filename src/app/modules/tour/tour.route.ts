import express from "express";
import { TourController } from "./tour.controller.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { Role } from "../user/user.interface.js";
import { validateRequest } from "../../middlewares/validateRequest.js";
import { createTourTypeZodSchema, createTourZodSchema, updateTourZodSchema } from "./tour.validation.js";
import { multerUpload } from "../../config/multer.config.js";

const router = express.Router();

/* ------------------ TOUR TYPE ROUTES -------------------- */

router.get("/tour-types", TourController.getAllTourTypes);

router.get(
    "/tour-types/:id",
    TourController.getSingleTourType
);

router.post(
    "/create-tour-type",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createTourTypeZodSchema),
    TourController.createTourType
);

router.patch(
    "/tour-types/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(createTourTypeZodSchema),
    TourController.updateTourType
);

router.delete("/tour-types/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), TourController.deleteTourType);

/* --------------------- TOUR ROUTES ---------------------- */

router.get("/", TourController.getAllTours);

router.get(
    "/:slug",
    TourController.getSingleTour
);

router.post(
    "/create",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    multerUpload.array("files"),
    validateRequest(createTourZodSchema),
    TourController.createTour
);

router.patch(
    "/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(updateTourZodSchema),
    TourController.updateTour
);

router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), TourController.deleteTour);




export const TourRoutes = router