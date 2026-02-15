import ApiError from "../utils/apiError.js";

import User from "../models/User.js";
import jwt from "jsonwebtoken";

export async function createUser(req, res, next) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      throw new ApiError(
        400,
        "Please provide all required fields",
        "MISSING_FIELDS",
      );
    }

    const newUser = await User.create({
      username,
      email,
      password,
    });

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //Deleting the password as password still saved in local object in server's memory
    newUser.password = undefined;
    return res.status(201).json({
      success: true,
      data: {
        user: newUser,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function handleLogin(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError(
        400,
        "Please provide all required fields: email, and password",
        "MISSING_FIELDS",
      );
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError(401, "Invalid email or password", "INVALID_CREDENTIALS");
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    //Deleting the password as password select =true currently
    user.password = undefined;

    return res.status(200).json({
      success: true,
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
}
