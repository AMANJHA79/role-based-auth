const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//register a new user
const RegisterUser = async (req, res) => {
  try {
    const { userName, email, password, role } = req.body;
    if (!userName || !email || !password ) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      role
    });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//login a user

const loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    //check if user exists and password is correct
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //generate a token for the user

    const token = jwt.sign(
      {
        userId: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h", // token will expire in 1 hour
      }
    );

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//change password 

const changePassword = async (req, res) => {
  try {
    const userId = req.userInfo.userId;

    // Extract old and new password
    const { oldPassword, newPassword } = req.body;

    // Find the current user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Check if old password is correct
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Old password is incorrect' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    user.password = hashedPassword;
    await user.save();
    
    res.status(200).json({ 
      success: true,  // Status of the operation
      message: 'Password changed successfully' 
    });

  } catch (error) {
    console.error('Error in changePassword:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}









module.exports = {
    RegisterUser,
    loginUser,
    changePassword
};
