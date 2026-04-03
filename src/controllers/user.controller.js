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
      role: "Viewer",
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
      user: {
        userId: new_user._id,
        name: new_user.name,
        email: new_user.email,
        role: new_user.role,
      },
    };
    return res
      .status(201)
      .json(ApiResponse.success(data, "User created successfully", 201));
  } catch (error) {
    return res
      .status(500)
      .json(
        ApiResponse.error(
          `Internal server error in creating user : ${error.message}`,
          500,
        ),
      );
  }
};
const login_user = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json(
          ApiResponse.error("User does not exist, please register first", 401),
        );
    }
    if (!user.isactive) {
      return res
        .status(403)
        .json(
          ApiResponse.error(
            "User account is deactivated, please contact Admin",
            403,
          ),
        );
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.hashedPassword,
    );
    if (!isPasswordCorrect) {
      return res.status(401).json(ApiResponse.error("Invalid password", 401));
    }
    const jwtToken = jwt.sign(
      { email: user.email, id: user._id, role: user.role },
      process.env.Authentication_for_jsonwebtoken,
      { expiresIn: "24h" },
    );
    const data = {
      token: jwtToken,
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
    return res
      .status(200)
      .json(ApiResponse.success(data, "User logged in successfully", 200));
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json(
        ApiResponse.error(
          `Internal server error in logging user: ${error.message}`,
          500,
        ),
      );
  }
};
const change_user_role = async (req, res) => {
  try {
    const { newrole, user_id } = req.body;
    if (!newrole) {
      return res
        .status(400)
        .json(ApiResponse.error("please provide new role", 400));
    }
    console.log(req.user._id);
    console.log(user_id);
    if (user_id === req.user._id.toString()) {
      return res
        .status(403)
        .json(ApiResponse.error("You cannot change your own role", 403));
    }
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json(ApiResponse.error("User not found", 404));
    }
    user.role = newrole;
    await user.save();
    return res
      .status(200)
      .json(ApiResponse.success(user, "User role updated successfully", 200));
  } catch (error) {
    return res
      .status(500)
      .json(
        ApiResponse.error(
          `Internal server error in changing user role: ${error.message}`,
          500,
        ),
      );
  }
};
const change_user_status = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (user_id === req.user._id.toString()) {
      return res
        .status(403)
        .json(ApiResponse.error("You cannot change your own status", 403));
    }
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json(ApiResponse.error("User not found", 404));
    }
    user.isactive = !user.isactive;
    await user.save();
    return res
      .status(200)
      .json(
        ApiResponse.success(
          user,
          `User account has been ${user.isactive ? "activated" : "deactivated"} successfully`,
          200,
        ),
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        ApiResponse.error(
          `Internal server error in changing user status: ${error.message}`,
          500,
        ),
      );
  }
};

const get_all_users = async (req, res) => {
  try {
    const allusers = await User.find();
    if (!allusers) {
      return res.status(200).json(ApiResponse.error("No users found", 200));
    }
    return res
      .status(200)
      .json(
        ApiResponse.success(allusers, "All users retrieved successfully", 200),
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        ApiResponse.error(
          `Internal server error in retrieving all users: ${error.message}`,
          500,
        ),
      );
  }
};
export {
  create_user,
  login_user,
  change_user_role,
  change_user_status,
  get_all_users,
};
