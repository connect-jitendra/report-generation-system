
import "dotenv/config";
import app from "./app.js";

// Start the Express HTTP server after loading environment variables.
// Keep server initialization separate from app configuration.
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Report Generation Server started on PORT ${PORT}`);
});
