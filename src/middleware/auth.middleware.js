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
    const user = await User.findById(decoded.id).select("-password").lean();
    if (!user) {
      return res.status(401).json(ApiResponse.error(`User not found`, 401));
    }
    if(user.isactive === false){
      return res.status(403).json(ApiResponse.error(`User account is deactivated, please contact an administrator`, 403));
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json(ApiResponse.error("Invalid token", 401));
    }
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json(ApiResponse.error("Token has expired, please login again", 401));
    }
    return res
      .status(500)
      .json(ApiResponse.error(`Internal server error: ${error.message}`, 500));
  }
};

export { auth_middleware };
