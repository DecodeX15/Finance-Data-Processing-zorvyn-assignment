import Transaction from "../models/transaction.model";
import ApiResponse from "../utils/Apiresponse";
const create_transaction = async (req, res) => {
  const { amount, type, category, title, description } = req.body;
  try {
    const newtrans = await Transaction.create({
      amount,
      type,
      title: title || "",
      category,
      description: description || "",
      createdBy: req.user.id,
    });
    return res
      .status(201)
      .json(
        ApiResponse.success(newtrans, "Transaction created successfully ", 201),
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        ApiResponse.error(
          `Internal server error in creating transaction: ${error.message}`,
          500,
        ),
      );
  }
};

const get_all_transactions = async (req, res) => {
  try {
    const alltrans = await Transaction.find().sort({ createdAt: -1 });
    if (alltrans.length === 0) {
      return res
        .status(404)
        .json(ApiResponse.error("No transactions found", 404));
    }
    return res
      .status(200)
      .json(
        ApiResponse.success(alltrans, "Transactions fetched successfully", 200),
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        ApiResponse.error(
          `Internal server error in fetching all transactions: ${error.message}`,
          500,
        ),
      );
  }
};

const get_transaction_by_id = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json(ApiResponse.error("Transaction ID is required", 400));
    }
    const trans = await Transaction.findById(id);
    if (!trans) {
      return res
        .status(404)
        .json(ApiResponse.error("Transaction not found", 404));
    }
    return res
      .status(200)
      .json(
        ApiResponse.success(trans, "Transaction fetched successfully", 200),
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        ApiResponse.error(
          `Internal server error in fetching transaction: ${error.message}`,
          500,
        ),
      );
  }
};

const update_transaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, type, category, title, description } = req.params;
    const updatedtrans = await Transaction.findByIdAndUpdate(
      id,
      {
        ...(amount && { amount }),
        ...(type && { type }),
        ...(category && { category }),
        ...(title && { title }),
        ...(description && { description }),
      },
      { new: true },
    );
    if(!updatedtrans){
        return res.status(404).json(ApiResponse.error("Transaction not found", 404));
    }
    return res
      .status(200)
      .json(
        ApiResponse.success(updatedtrans, "Transaction updated successfully", 200),
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        ApiResponse.error(
          `Internal server error in updating transaction: ${error.message}`,
          500,
        ),
      );
  }
};

const delete_transaction = async (req, res) => {
  try {
    const { id } = req.body;
    const deletedtrans = await Transaction.findByIdAndDelete(id);
    if (!deletedtrans) {
      return res
        .status(404)
        .json(ApiResponse.error("Transaction not found", 404));
    }
    return res
      .status(200)
      .json(
        ApiResponse.success(deletedtrans, "Transaction deleted successfully", 200),
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        ApiResponse.error(
          `Internal server error in deleting transaction: ${error.message}`,
          500,
        ),
      );
  }
};

// now we have to work on the Filtering records based on criteria such as date, category, or type
export {
  create_transaction,
  get_all_transactions,
  get_transaction_by_id,
  update_transaction,
  delete_transaction,
};
