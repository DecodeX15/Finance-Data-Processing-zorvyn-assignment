import ApiResponse from "../utils/Apiresponse.js";

const requireAdmin = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json(ApiResponse.error("Admin access only", 403));
  }
  next();
};

const requireAnalyst = (req, res, next) => {
  if (req.user.role !== "Admin" && req.user.role !== "Analyst") {
    return res
      .status(403)
      .json(ApiResponse.error("Admin and Analyst access only", 403));
  }
  next();
};

export { requireAdmin, requireAnalyst };
