
import { S3Client } from "@aws-sdk/client-s3";

// Create a reusable AWS S3 client for uploading and downloading reports.
// AWS credentials are resolved through the SDK's default credential provider chain.
const s3Client = new S3Client({
    region: process.env.AWS_REGION
});

export default s3Client;
