
import reportQueue from "../src/modules/reports/queues/report.queue.js"


async function checkRedisConnection() {

    try {
        await reportQueue.waitUntilReady();
        console.log("Redis is connected");

    } catch (error) {
       console.error("Redis connection failed:", error.message);
    }
    finally {
    await reportQueue.close();
    console.log("Redis queue connection closed");
}
}

checkRedisConnection();
