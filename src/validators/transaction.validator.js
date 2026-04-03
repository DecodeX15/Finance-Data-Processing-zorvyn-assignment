import joi from "joi";

const create_transaction_schema = joi.object({
  amount: joi.number().required(),
  type: joi.string().valid("Income", "Expense").required(),
  category: joi.string(),
  title: joi.string().trim().allow(""),
  description: joi.string().trim().allow(""),
});

export { create_transaction_schema };
