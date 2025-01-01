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

module.exports = {
    RegisterUser,
    loginUser
};
