import { Router } from "express";
const router: Router = Router();

import * as authMiddleware from "../middlewares/auth.middleware";

import * as controller from "../controllers/user.controller";

router.post("/register", controller.register);
router.post("/login", controller.login);
// router.post("/password/forgot", controller.forgotPassword);
// router.post("/password/otp", controller.otpPassword);
// router.post("/password/reset", controller.resetPassword);
router.get("/detail", authMiddleware.requireAuth, controller.detail);
// router.get("/list", authMiddleware.requireAuth, controller.list);

export const userRoute: Router = router;