
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client from "../../../config/s3.js";

// Upload generated CSV content to the private S3 bucket.
// The object key is stored in PostgreSQL for future downloads.
const uploadReportToS3 = async (csvData, s3Key) => {
    const command = new PutObjectCommand({
        Bucket: "report-generation-system-dev",
        Key: s3Key,
        Body: csvData,
        ContentType: "text/csv",
    });

    await s3Client.send(command);
};

// Generate a temporary presigned URL for downloading a report from S3.
// The caller must verify report ownership and completion status before invoking this function.
const generateReportDownloadUrl = async (s3Key) => {
    const command = new GetObjectCommand({
        Bucket: "report-generation-system-dev",
        Key: s3Key,
    });

    // Allow access to the specific S3 object for 60 seconds without exposing AWS credentials.
    const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    return downloadUrl;
};

export { uploadReportToS3, generateReportDownloadUrl };
