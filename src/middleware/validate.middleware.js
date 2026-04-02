import { create_user_schema ,login_user_schema} from "../validators/user.validator.js";
import ApiResponse from "../utils/Apiresponse.js";
const validatecreateuser = (req, res, next) => {
  try {
    const { error, value } = create_user_schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return res
        .status(400)
        .json(
          ApiResponse.error(
            error.details.map((e) => e.message).join(", "),
            400,
          ),
        );
    }
    req.body = value;
    next();
  } catch (error) {
    return res.status(400).json(ApiResponse.error(error.message, 400));
  }
};
const validateloginuser = (req, res, next) => {
  try {
    const { error, value } = login_user_schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      return res
        .status(400)
        .json(
          ApiResponse.error(
            error.details.map((e) => e.message).join(", "),
            400,
          ),
        );
    }
    req.body = value;
    next();
  } catch (error) {
    return res.status(400).json(ApiResponse.error(error.message, 400));
  }
};
export { validatecreateuser, validateloginuser };
