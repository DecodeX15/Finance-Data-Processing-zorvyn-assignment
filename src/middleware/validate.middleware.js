import {
  create_user_schema,
  login_user_schema,
} from "../validators/user.validator.js";
import { create_transaction_schema } from "../validators/transaction.validator.js";
import ApiResponse from "../utils/Apiresponse.js";
const validatecreateuser = (req, res, next) => {
  try {
    const { error, value } = create_user_schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    // console.log(error);
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
    return res
      .status(400)
      .json(
        ApiResponse.error(
          `Internal server error in create user validation error: ${error.message}`,
          400,
        ),
      );
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
    return res
      .status(400)
      .json(
        ApiResponse.error(
          `Internal server error in login validation error: ${error.message}`,
          400,
        ),
      );
  }
};

const vaidate_create_transaction = (req, res, next) => {
  try {
    const { error, value } = create_transaction_schema.validate(req.body, {
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
    return res
      .status(400)
      .json(
        ApiResponse.error(
          `Internal server error in transaction validation error: ${error.message}`,
          400,
        ),
      );
  }
};
export { validatecreateuser, validateloginuser, vaidate_create_transaction };
