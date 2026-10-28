import express from "express";
import testRoutes from "./routes/test.routes.js";
import reportRoutes from "./modules/reports/routes/report.routes.js";
const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is healthy",
  });
});

app.use("/api", testRoutes);
app.use("/api/reports", reportRoutes);

export default app;
