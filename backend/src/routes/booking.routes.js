import { Router } from "express";
import { createBooking, getAllBooking, getBookingById, updateStatus } from "../controllers/booking.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/create-booking").post(verifyJWT, upload.none(), createBooking)
router.route("/all-booking").get(verifyJWT, upload.none(), getAllBooking)
router.route("/get-booking/:id").get(verifyJWT, upload.none(), getBookingById)

router.route("/update-status/:id").patch(verifyJWT, updateStatus);


export default router;