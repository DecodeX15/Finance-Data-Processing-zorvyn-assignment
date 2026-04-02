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
export default app;
