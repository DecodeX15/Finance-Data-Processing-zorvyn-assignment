import Transaction from "../models/transaction.model.js";
import ApiResponse from "../utils/Apiresponse.js";
const create_transaction = async (req, res) => {
  const { amount, type, category, title, description } = req.body;
  try {
    const newtrans = await Transaction.create({
      amount,
      type,
      title: title || "",
      category,
      description: description || "",
      createdBy: req.user._id,
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
    const {
      type,
      category,
      startDate,
      endDate,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (type) filter.type = type;
    if (category) filter.category = category;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    console.log(filter);
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    return res
      .status(200)
      .json(
        ApiResponse.success(
          transactions,
          "Transactions fetched successfully",
          200,
        ),
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        ApiResponse.error(
          `Internal server error in fetching transactions: ${error.message}`,
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
    if (!updatedtrans) {
      return res
        .status(404)
        .json(ApiResponse.error("Transaction not found", 404));
    }
    return res
      .status(200)
      .json(
        ApiResponse.success(
          updatedtrans,
          "Transaction updated successfully",
          200,
        ),
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
        ApiResponse.success(
          deletedtrans,
          "Transaction deleted successfully",
          200,
        ),
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

const dashboard_summary = async (req, res) => {
  // console.log(req.user)
  try {
    const totals = await Transaction.aggregate([
      { $match: { createdBy: req.user._id } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);
    console.log(totals);
    const categorywise = await Transaction.aggregate([
      { $match: { createdBy: req.user._id } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);
    const recent = await Transaction.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    const monthly = await Transaction.aggregate([
      { $match: { createdBy: req.user._id } },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
    ]);
    if (totals.length === 0) {
      return res
        .status(200)
        .json(
          ApiResponse.success(
            "No transactions found for dashboard summary",
            200,
          ),
        );
    }
    return res
      .status(200)
      .json(
        ApiResponse.success(
          { totals, categorywise, recent, monthly },
          "Dashboard summary fetched successfully",
          200,
        ),
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        ApiResponse.error(
          `Internal server error in fetching dashboard summary: ${error.message}`,
          500,
        ),
      );
  }
};

export {
  create_transaction,
  get_all_transactions,
  get_transaction_by_id,
  update_transaction,
  delete_transaction,
  dashboard_summary,
};
