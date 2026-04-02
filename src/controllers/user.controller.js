import User from "../models/user.model.js";
import ApiResponse from "../utils/Apiresponse.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const create_user = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existuser = await User.findOne({ email });
    if (existuser) {
      return res
        .status(409)
        .json(ApiResponse.error("User already exists, please login", 409));
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const new_user = new User({
      name,
      email,
      hashedPassword: hashPassword,
      role: "Admin",
      isactive: true,
    });
    if (!new_user) {
      return res
        .status(409)
        .json(ApiResponse.error("Failed to create user", 409));
    }
    await new_user.save();
    const jwttoken = jwt.sign(
      { email: new_user.email, id: new_user._id, role: new_user.role },
      process.env.Authentication_for_jsonwebtoken,
      { expiresIn: "1d" },
    );
    const data = {
      token: jwttoken,
    };
    return res
      .status(201)
      .json(ApiResponse.success(data, "User created successfully", 201));
  } catch (error) {
    return res
      .status(500)
      .json(ApiResponse.error("Internal server error", 500));
  }
};
const login_user = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json(
          ApiResponse.error("User does not exist, please register first", 404),
        );
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordCorrect) {
      return res.status(401).json(ApiResponse.error("Invalid password", 401));
    }
    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id, role: user.role },
      process.env.Authentication_for_jsonwebtoken,
      { expiresIn: "24h" },
    );
    const data = {
      token: jwtToken,
    };
    return res
      .status(200)
      .json(ApiResponse.success(data, "User logged in successfully", 200));
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json(ApiResponse.error(`Error in logging in: ${error.message}`, 500));
  }
};
export { create_user, login_user };
