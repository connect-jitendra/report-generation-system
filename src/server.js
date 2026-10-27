import "dotenv/config";
import app from "./app.js";

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Report Generation Server started on PORT ${PORT}`);
});

