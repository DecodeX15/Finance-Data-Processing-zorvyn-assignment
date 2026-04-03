import jwt from "jsonwebtoken";
import ApiResponse from "../utils/Apiresponse.js";
import User from "../models/user.model.js";
const auth_middleware = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    console.log(token);
    if (!token) {
      console.log("token nahi aaya hai");
      return res
        .status(401)
        .json(ApiResponse.error(`No authorization token provided`, 401));
    }
    const decoded = jwt.verify(
      token,
      process.env.Authentication_for_jsonwebtoken,
    );
    console.log(decoded);
    const user = await User.findById(decoded._id).select("-password").lean();
    if (!user) {
      return res.status(401).json(ApiResponse.error(`User not found`, 401));
    }
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(500)
      .json(
        ApiResponse.error(
          `Internal server error in auth middleware: ${error.message}`,
          500,
        ),
      );
  }
};

export { auth_middleware };
