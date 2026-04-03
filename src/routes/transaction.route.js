import { Router } from "express";
import {
  create_transaction,
  get_all_transactions,
  get_transaction_by_id,
  update_transaction,
  delete_transaction,
  dashboard_summary,
} from "../controllers/transactions.controller.js";
import { vaidate_create_transaction } from "../middleware/validate.middleware.js";
import {
  requireAnalyst,
  requireAdmin,
} from "../middleware/rolaccess.middlware.js";
import { auth_middleware } from "../middleware/auth.middleware.js";
const transaction_router = Router();
// Admin accessible routes
transaction_router.post(
  "/create-transaction",
  auth_middleware,
  requireAdmin,
  vaidate_create_transaction,
  create_transaction,
);
transaction_router.put(
  "/update-transaction/:id",
  auth_middleware,
  requireAdmin,
  update_transaction,
);
transaction_router.delete(
  "/delete-transaction/:id",
  auth_middleware,
  requireAdmin,
  delete_transaction,
);
// admin and analyst accessible routes
transaction_router.get(
  "/get-transaction/:id",
  auth_middleware,
  requireAnalyst,
  get_transaction_by_id,
);
transaction_router.get(
  "/get-all-transactions",
  auth_middleware,
  requireAnalyst,
  get_all_transactions,
);
// accessible by all authenticated users (dashboard summary)
transaction_router.get(
  "/dashboard-summary",
  auth_middleware,
  dashboard_summary,
);
export default transaction_router;
