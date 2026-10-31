
import express from "express";
import testRoutes from "./routes/test.routes.js";
import reportRoutes from "./modules/reports/routes/report.routes.js";

const app = express();

// Parse incoming JSON request bodies and serve frontend static files.
app.use(express.json());
app.use(express.static("frontend"));

// Health check endpoint for verifying that the API server is running.
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is healthy",
  });
});

// Register application routes under their respective API prefixes.
app.use("/api", testRoutes);
app.use("/api/reports", reportRoutes);

export default app;
