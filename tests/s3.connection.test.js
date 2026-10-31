
import "dotenv/config";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "../src/config/s3.js";

const bucketName = "report-generation-system-dev";
const objectKey = "reports/connection-test.txt";

const testS3Connection = async () => {
    try {
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: objectKey,
            Body: "Hello! AWS S3 connection successful.",
            ContentType: "text/plain",
        });

        const response = await s3Client.send(command);

        console.log("S3 upload successful!");
        console.log("Bucket:", bucketName);
        console.log("Object Key:", objectKey);
        console.log("HTTP Status:", response.$metadata.httpStatusCode);

    } catch (error) {
        console.error("S3 upload failed:", error);
        process.exitCode = 1;
    }
};

await testS3Connection();
