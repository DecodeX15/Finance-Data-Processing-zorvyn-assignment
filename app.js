import express from "express";
import rateLimit from "express-rate-limit";
const app = express();
import cors from "cors";

const globallimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 50,
  message: "Too many requests from this IP, please try again after some time",
});
app.use(globallimiter);
app.use(
  cors({
    origin: "*",
    credentials: false,
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
