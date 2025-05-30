import mongoose from "mongoose";
const otpSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    otp: {
        type: String,
        // required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: "15m", // otp will expire after 15mins
    },
    verified: {
        type: Boolean,  
        default: false,
    },
}, { timestamps: true });

const OTP = mongoose.model("OTP", otpSchema)
export default OTP