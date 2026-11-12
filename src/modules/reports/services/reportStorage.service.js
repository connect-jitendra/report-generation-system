
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3Client from "../../../config/s3.js";


const uploadReportToS3 = async (fileData, s3Key, format) => {
    const contentType =
        format === "csv"
            ? "text/csv"
            : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    const command = new PutObjectCommand({
        Bucket: "report-generation-system-dev",
        Key: s3Key,
        Body: fileData,
        ContentType: contentType,

    });

    await s3Client.send(command);
};

const generateReportDownloadUrl = async (s3Key) => {
    const command = new GetObjectCommand({
        Bucket: "report-generation-system-dev",
        Key: s3Key,
    });


    const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    return downloadUrl;
};

export { uploadReportToS3, generateReportDownloadUrl };
