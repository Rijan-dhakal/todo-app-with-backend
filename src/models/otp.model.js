import mongoose from "mongoose";
import User from "./user.model.js";

const otpSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 900, 
    },
    verified: {
        type: Boolean,  
        default: false,
    }
}, { timestamps: true });

 
otpSchema.statics.cleanupExpiredUsers = async function() {
    try {
        const expiredOTPs = await this.find({
            verified: false,
            createdAt: { $lt: new Date(Date.now() - 13 * 60 * 1000) }
        });

        for (const otp of expiredOTPs) {
            await User.findByIdAndDelete(otp.userId);
            await this.findByIdAndDelete(otp._id);
        }
        
        if (expiredOTPs.length > 0) {
            console.log(` ${expiredOTPs.length} expired users removed`);
        }
    } catch (error) {
        console.error('Error during cleanup:', error);
    }
};

const OTP = mongoose.model("OTP", otpSchema)
export default OTP