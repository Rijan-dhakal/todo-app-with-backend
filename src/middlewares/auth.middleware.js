import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authorize = async (req, res, next) => {
  try {
    
    const token = req.cookies.token

    if (!token) {
      return res.redirect('/register')
  //  return res.status(401).json({success: false, message: "Authorization token missing", error:"Unauthorized" });
   
}

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = user;

    next();
  } catch (error) {
    // res.status(401).json({ message: "Unauthorized", error: error.message });
    return res.redirect('/register')

  }
};

export default authorize;
