import { S3Client } from "@aws-sdk/client-s3";

export function createS3Client(
    accessKey: string,
    secretKey: string,
    region: string
): S3Client {
    return new S3Client({
        region,
        credentials: {
            accessKeyId: accessKey,
            secretAccessKey: secretKey,
        },
    });
}