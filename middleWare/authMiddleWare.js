const JWT = require("jsonwebtoken")
const userModel = require("../model/userModel");

// Middleware to check JWT token
const requireSignIn = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token required"
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { _id: user._id }

    // (Optional) fetch full user from DB
    const user = await userModel.findById(decoded._id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

// admin access 
// if user role is 1 then access the admin
const isAdmin = async(req,res,next)=>{
    try {
        const user = await userModel.findById(req.user._id)
        if(user.role !== 1){
            return res.status(401).send({
                success:false,
                message:"Unauthorized Access"
            })
        } else{
            next();
        }
    } catch (error) {
        res.status(401).send({
            success:false,
            message:"error in admin middleWare"
        })
    }
};

module.exports = {requireSignIn,isAdmin}