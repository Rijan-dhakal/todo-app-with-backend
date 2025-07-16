import OTP from "../models/otp.model.js";
import User from "../models/user.model.js";
import jwt from 'jsonwebtoken'

export const verifyOtp = async (req, res, next) => {
    try {
        const userId = req.cookies.userid
        
        const { otp} = req.body

        // checking if all fields are valid

        if(!userId || !otp){
            const error = new Error("UserId and otp are required")
            error.statusCode = 400
            throw error;
        }
        // checking if userId is valid  

        const existingOtp = await OTP.findOne({userId, otp, verified:false})



        if(!existingOtp){
            const error = new Error("Invalid or expired otp")
            error.statusCode = 400
            throw error;
        }

        existingOtp.verified = true;

        await existingOtp.save()

        const user = await User.findByIdAndUpdate(userId, {verified:true})

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(201).json({
            success: true,
            message:"OTP verification successful, User is now logged in",
            user:{
                _id:user._id,
                email: user.email,
                username:user.username
            }
        })


    } catch (error) {
       next(error) 
    }
}