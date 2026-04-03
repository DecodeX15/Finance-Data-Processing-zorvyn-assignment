import joi from "joi";

const create_user_schema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});
const login_user_schema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});
export { create_user_schema, login_user_schema };
