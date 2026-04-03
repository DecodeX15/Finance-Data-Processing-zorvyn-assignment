import joi from 'joi';

const create_transaction_schema = joi.object({
    amount: joi.number().required(),
    type: joi.string().valid("Income", "Expense").required(),
    category: joi.string().required(),
});

export {create_transaction_schema};