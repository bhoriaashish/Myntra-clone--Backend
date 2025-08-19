const {hashPassword,comparePassword} = require("../helpers/authHelper");
const userModel = require("../model/userModel");
const JWT = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

//Post/REGISTER
//here we take input from body to register in application
const registerController = async (req,res) =>{
    try {
        const {name,email,password,phone} = req.body;
        if(!name){
            return res.send({message:"Name is Required"});
        }
        if(!email){
            return res.send({message:"Email is Required"})
        }
        if(!password){
            return res.send({message:"Password is Required"})
        }
        if(!phone){
            return res.send({message:"Phone is Required"})
        }
        // check user in our database if user is exist in database we are not going to create user
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.status(409).json({
                success:true,
                message:"Alredy Register please login"
            })
        }
        // if user not exist in database we register the user
        // here we create hashedPassword using hashPassword function that we create in helpers file in authHelper.js
        const hashedPassword = await hashPassword(password)
        // save all the inputs in database
        const user = await new userModel({
            name,
            email,
            password: hashedPassword,
            phone
        }).save();
        res.status(201).send({
            success:true,
            message:"User Register Successfully",
            user
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"error in register",
            error
        })
    }
}

//POST |  Login 
const loginController = async (req,res) =>{
    try {
        const {email, password} = req.body
        if(!email || !password){
            res.status(400).send({
                success:false,
                message:"Inalid password or email" 
            })
        }
        const user = await userModel.findOne({email})
        if(!user){
            res.status(404).send({
                success:false,
                message:"email is not recognized"
            })
        }
        const match = await comparePassword(password, user.password)
        if(!match){
            return res.status(401).send({
                success:false,
                message:"Invalid password"
            })
        }
        //Token
        const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {expiresIn: "7d"})
        res.status(200).json({
            success:true,
            message:"login successful",
            user:{
                _id:user._id,
                name: user.name,
                email:user.email,
                phone:user.phone
            },
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in login",
            error
        });
    }
};

// Single Forgot/Reset Password Controller
const forgotPasswordController = async (req, res) => {
    try {
      const { email } = req.body;
  
      if (!email) {
        return res.status(400).send({
          success: false,
          message: "Email is required",
        });
      }
  
      // Check if user exists
      const user = await userModel.findOne({ email });
  
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found",
        });
      }
  
      // Create token (valid for 10 min)
      const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "10min",
      });
  
      // Instead of sending an email, send token in response
      return res.status(200).send({
        success: true,
        message: "Token generated. Redirect to reset password.",
        token, // frontend will use this to navigate
      });
  
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }

};
const resetPasswordController = async (req, res) => {
    try {
      const { token, newPassword, confirmPassword } = req.body;
  
      if (!token || !newPassword || !confirmPassword) {
        return res.status(400).send({
          success: false,
          message: "All fields are required",
        });
      }
  
      if (newPassword !== confirmPassword) {
        return res.status(400).send({
          success: false,
          message: "Passwords do not match",
        });
      }
  
      let decoded;
      try {
        decoded = JWT.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return res.status(401).send({
          success: false,
          message: "Invalid or expired token",
        });
      }
  
      const user = await userModel.findById(decoded.id);
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found",
        });
      }
  
      const isStrong = newPassword.length >= 8 && /\d/.test(newPassword);
      if (!isStrong) {
        return res.status(400).send({
          success: false,
          message: "Password must be at least 8 characters long and include a number.",
        });
      }
  
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
  
      return res.status(200).send({
        success: true,
        message: "Password has been reset successfully.",
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
};
// test controller
const testController = (req,res) => {
    res.send("proteced route")
}

module.exports = {
    registerController,
    loginController,
    forgotPasswordController,
    resetPasswordController,
    testController,
  };
