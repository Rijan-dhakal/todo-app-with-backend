import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import OTP from "../models/otp.model.js"
import jwt from "jsonwebtoken"

import { sendReminderEmail } from "../utils/send-email.js";

// Register a new user
export const register = async (req, res, next) => {
    try{
  // getting data from request body
  const { username, email, password } = req.body;

  // checking if all fields are valid
  if (!username || !email || !password) {
    const error = new Error("Username, email and password are required.");
    error.statusCode = 400;
    throw error;
  }
  if (username.length < 3 || username.length > 20) {
    const error = new Error(
      "Username must be between 3 and 20 characters long."
    );
    error.statusCode = 400;
    throw error;
  }
  // checking if username contains only letters and numbers
  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    const error = new Error("Username must contain only letters and numbers.");
    error.statusCode = 400;
    throw error;
  }
  if (password.length < 6) {
    const error = new Error("Password must be at least 6 characters long.");
    error.statusCode = 400;
    throw error;
  }
  // checking if email is valid
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    const error = new Error("Please provide a valid email address.");
    error.statusCode = 400;
    throw error;
  }

  // checking if user already exists
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    const error = new Error("Email already registered.");
    error.statusCode = 400;
    throw error;
  }

  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    const error = new Error("Username already taken.");
    error.statusCode = 400;
    throw error;
  }

  
  // hashing password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // creating a user
   const newUser = await User.create({username, email, password: hashedPassword});

   // create a OTP
   const otpValue = Math.floor(100000 + Math.random() * 900000).toString();

  // creating the otp datas in db
    await OTP.create({
      userId: newUser._id,
      otp: otpValue
    });
    
    
    // sending an otp

    const recipientEmail = newUser.email; // The email you want to send OTP to
const otpCode = otpValue; // The OTP code you generated

sendReminderEmail({ to: recipientEmail, otpCode: otpCode })
  .then(() => console.log('OTP email sent successfully'))
  .catch((error) => console.error('Error sending OTP email:', error));


  


  res.status(201).json({
    success: true,
    message:"User created. Please verify OTP sent to your email.",
    userId: newUser._id
  })

} catch(error){
    next(error);
}
};


export const login = async (req, res, next) => {
  try {
    
    // getting email and password
    const {email, password} = req.body

    if(!email || !password){
      const error = new Error("Email and password are required")
      error.statusCode = 401;
      throw error
    }


    const existingUser = await User.findOne({email});
    
    if(!existingUser){
      const error = new Error("User not found");
      error.statusCode = 404
      throw error;

    }

    // checking if password is correct
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if(!isPasswordValid){
      const error = new Error("Invalid password");
      error.statusCode = 401
      throw error;
    }
    // creating a JWT
    const token = jwt.sign({userId: existingUser._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})

    // sending the response
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user:{
          userId: existingUser._id,
          email,
          token
      }
    })

  } catch (error) {
    next(error);
  }
}


