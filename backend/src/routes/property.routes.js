import { Router } from "express";
import { getAllProperties, getMyListings, getPropertyById, registerProperty, updatePropertyImages, updatePropertyInfo } from "../controllers/property.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

export const router = Router();

// Unsecure Routes
router.route("/all-properties").get(getAllProperties);
router.route("/get-property/:id").get(getPropertyById);

// Secure Route
router.route("/register-property").post(verifyJWT, upload.array("images", 8), registerProperty);
router.route("/update-property-info/:id").patch(verifyJWT, upload.none(), updatePropertyInfo);
router.route("/update-property-images/:id").patch(verifyJWT, upload.array("images", 8), updatePropertyImages);
router.route("/my-listings").get(verifyJWT, getMyListings);


/*
router.patch("/rooms/:id", verifyJWT, updateRoom); 
router.delete("/rooms/:id", verifyJWT, deleteRoom);
*/
export default router