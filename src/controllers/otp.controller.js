import OTP from "../models/otp.model.js";
import User from "../models/user.model.js";
import jwt from 'jsonwebtoken'

export const verifyOtp = async (req, res, next) => {
    try {
        
        const userId = req.cookies.userid
        const { otp } = req.body

        // checking if all fields are valid
        if(!userId || !otp){
            const error = new Error("UserId and otp are required")
            error.statusCode = 400
            throw error;
        }

        // Check if user exists
        const user = await User.findById(userId);
        if(!user){
            const error = new Error("User not found")
            error.statusCode = 404
            throw error;
        }

        // Check if user is already verified
        if(user.verified){
            const error = new Error("User is already verified")
            error.statusCode = 400
            throw error;
        }

        // Find the OTP record
        const existingOtp = await OTP.findOne({userId, otp, verified: false})

        if(!existingOtp){
            const error = new Error("Invalid or expired otp")
            error.statusCode = 400
            throw error;
        }

        existingOtp.verified = true;
        await existingOtp.save()

        // Update user verification status
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { verified: true }, 
            { new: true }
        )

        // Generate JWT token
        const token = jwt.sign(
            { userId: updatedUser._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRES_IN }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: 'strict'
        })

        res.clearCookie("userid")

        res.status(200).json({
            success: true,
            message: "OTP verification successful, User is now logged in",
            user: {
                _id: updatedUser._id,
                email: updatedUser.email,
                username: updatedUser.username,
                verified: updatedUser.verified
            }
        })


    } catch (error) {
       next(error) 
    }
}