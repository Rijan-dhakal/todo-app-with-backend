import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import { verifyOtp } from "../controllers/otp.controller.js";

const authRouter = Router();


authRouter.post("/register", register);
authRouter.post("/login", login)
authRouter.post("/otp", verifyOtp)

export default authRouter; 
