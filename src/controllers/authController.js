import User from "../models/User.js";
import jwt from "jsonwebtoken";

export async function createUser(req, res) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields: username, email, and password",
      });

    const newUser = await User.create({
      username,
      email,
      password,
    });

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });

    //Deleting the password as password still saved in local object in server's memory
    newUser.password=undefined
    return res.status(201).json({
      success: true,
      data: { 
        newUser,
        token
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function handleLogin(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: email, and password",
      });

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });

    //Deleting the password as password select =true currently
    user.password=undefined
    
    return res.status(200).json({
      success: true,
      data: {
        user,
        token
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
