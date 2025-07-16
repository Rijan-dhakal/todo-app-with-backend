import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import OTP from "../models/otp.model.js";
import jwt from "jsonwebtoken";

import { sendReminderEmail } from "../utils/send-email.js";
import { customError } from "../utils/customError.js";

// Register a new user
export const register = async (req, res, next) => {
  try {
    // getting data from request body
    if (!req.body) customError("All fields are required", 400);

    const { username, email, password } = req.body;

    // checking if all fields are valid
    if (!username || !email || !password)
      customError("All fields are required", 400);
    if (username.length < 3 || username.length > 20)
      customError("Username must be between 3 and 20 characters long.", 400);
    // checking if username contains only letters and numbers
    if (!/^[a-zA-Z0-9]+$/.test(username))
      customError("Username must contain only letters and numbers.", 400);
    // checking password length
    if (password.length < 6)
      customError("Password must be at least 6 characters long.", 400);
    // checking if email is valid
    if (!/^\S+@\S+\.\S+$/.test(email))
      customError("Please provide a valid email address.", 400);

    // checking if user already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) customError("Email already registered.", 400);

    const existingUsername = await User.findOne({ username });
    if (existingUsername) customError("Username already taken.", 400);

    // hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // creating a user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // create a OTP
    const otpValue = Math.floor(100000 + Math.random() * 900000).toString();

    // creating the otp datas in db
    await OTP.create({
      userId: newUser._id,
      otp: otpValue,
    });

    // sending an otp

    const recipientEmail = newUser.email; // The email you want to send OTP to
    const otpCode = otpValue; // The OTP code you generated

    sendReminderEmail({ to: recipientEmail, otpCode: otpCode })
      .then(() => console.log("OTP email sent successfully"))
      .catch((error) => console.error("Error sending OTP email:", error));

    res.cookie('userid', newUser._id, {
      httpOnly: true,
      secure: false,
      maxAge: 15 * 60 * 1000
    })

    res.status(201).json({
      success: true,
      message: "User created. Please verify OTP sent to your email.",
      userId: newUser._id,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    // getting email and password
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("Email and password are required");
      error.statusCode = 401;
      throw error;
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    // checking if password is correct
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      const error = new Error("Invalid password");
      error.statusCode = 401;
      throw error;
    }
    // creating a JWT
    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    // sending the response
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        userId: existingUser._id,
        email,
      },
    });
  } catch (error) {
    next(error);
  }
};
