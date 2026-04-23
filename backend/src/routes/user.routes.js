import { Router } from "express";
import { dashboardInfo, getCurrentUser, loginUser, logoutUser, refreshAccessToken, userRegister } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

export const router = Router();

router.route("/register").post(
    upload.fields([
    {
        name: "avatar",
        maxCount: 1
    }
]), 
userRegister
)

router.route("/login").post(upload.none(), loginUser)

// Secured Routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/dashboard").get(verifyJWT, dashboardInfo)
router.route("/refreshToken").post(refreshAccessToken)

export default router