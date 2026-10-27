import express from "express";
const app = express();

app.get("/health", (req, res) => {
    res.status(200).json({
        "status": "success",
        "message": "Server is healthy"
    });
})


export default app;