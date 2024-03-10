import express from "express";
const router = express.Router();

// Import your controller
import AuthContoller from "../controllers/authController.js";

router.route('/register').post(AuthContoller.registerUser);
router.route('/login').post(AuthContoller.loginUser);
router.route('/update').put(AuthContoller.updateUserProfile);
router.route('/logout').get(AuthContoller.logoutUser);
router.route("/forgot-password").post(AuthContoller.forgotPassword);
router.route("/reset-password/:resetToken").patch(AuthContoller.resetPassword);

export default router;