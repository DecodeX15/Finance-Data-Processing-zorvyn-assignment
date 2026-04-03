import express from "express";
const app = express();
import cors from "cors";
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.use(
  express.json({
    limit: "50mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  }),
);
import userrouter from "./src/routes/user.route.js";
app.use("/api/zorkyn/v1/user", userrouter);
import transaction_router from "./src/routes/transaction.route.js";
app.use("/api/zorkyn/v1/transaction", transaction_router);
export default app;
