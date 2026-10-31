
import { Queue } from "bullmq";

// Create a BullMQ queue backed by Redis for asynchronous report generation.
// The worker consumes jobs from this same queue using the "report-generation" name.
const reportQueue = new Queue("report-generation", {
    connection: {
        host: "localhost",
        port: 6379,
    },
});

export default reportQueue;
