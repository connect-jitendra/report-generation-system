import { Queue } from "bullmq";

const reportQueue = new Queue("report-generation", {
    connection: {
        host: "localhost",
        port: 6379,
    },
});


export default reportQueue;