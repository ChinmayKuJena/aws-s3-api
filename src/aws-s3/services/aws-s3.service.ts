import {
    Injectable,
    Logger,
    BadRequestException,
} from "@nestjs/common";
import {
    ListBucketsCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    DeleteObjectCommand,
    Bucket,
    GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createS3Client } from "../helpers/s3-client.factory";
import { AWS3Bucket, AWS3ConfigBase, AWS3DeleteConfig, AWS3ListBucketsConfig, AWS3Object, AWS3SignedUrlConfig, AWS3UploadConfig } from "../aws-s3.modles";

@Injectable()
export class AwsS3Service {
    private logger = new Logger(AwsS3Service.name);

    private getClient(accessKey: string, secretKey: string, region: string) {
        return createS3Client(accessKey, secretKey, region);
    }

    async listBuckets(credentials: AWS3ConfigBase): Promise<AWS3Bucket[]> {
        const { accessKey, secretKey, region } = credentials;
        try {
            const s3 = this.getClient(accessKey, secretKey, region);

            const result = await s3.send(new ListBucketsCommand({}));
            this.logger.log(`Buckets retrieved: ${JSON.stringify(result.Buckets)}`);
            return result.Buckets ?? [];
        } catch (error) {
            this.logger.error(`Error listing buckets: ${error instanceof Error ? error.message : String(error)}`);
            throw new BadRequestException(error instanceof Error ? error.message : String(error));
        }
    }

    async listObjects(
        credentials: AWS3ListBucketsConfig
    ): Promise<AWS3Object[]> {
        const { accessKey, secretKey, region, bucket, prefix } = credentials;
        try {
            const s3 = this.getClient(accessKey, secretKey, region);

            const result = await s3.send(
                new ListObjectsV2Command({
                    Bucket: bucket,
                    Prefix: prefix,
                })
            );

            this.logger.log(`Objects retrieved from bucket ${bucket}: ${JSON.stringify(result.Contents)}`);
            return result.Contents ?? [];
        } catch (error) {
            this.logger.error(`Error listing objects in bucket ${bucket}: ${error instanceof Error ? error.message : String(error)}`);
            throw new BadRequestException(error instanceof Error ? error.message : String(error));
        }
    }
    async uploadObject(
        s3UploadCredentials: AWS3UploadConfig,
    ) {
        const { accessKey, secretKey, region, bucket, key, body } = s3UploadCredentials;
        try {
            const s3 = this.getClient(accessKey, secretKey, region);

            await s3.send(
                new PutObjectCommand({
                    Bucket: bucket,
                    Key: key,
                    Body: body,
                })
            );

            this.logger.log(`Object uploaded to bucket ${bucket} with key ${key}`);
            return { success: true };
        } catch (error) {
            this.logger.error(`Error uploading object to bucket ${bucket} with key ${key}: ${error instanceof Error ? error.message : String(error)}`);
            throw new BadRequestException(error instanceof Error ? error.message : String(error));
        }
    }

    async deleteObject(
        credentials: AWS3DeleteConfig
    ) {
        try {
            const { accessKey, secretKey, region, bucket, key } = credentials;
            const s3 = this.getClient(accessKey, secretKey, region);

            await s3.send(
                new DeleteObjectCommand({
                    Bucket: bucket,
                    Key: key,
                })
            );

            this.logger.log(`Object deleted from bucket ${bucket} with key ${key}`);
            return { success: true };
        } catch (error) {
            this.logger.error(`Error deleting object from bucket ${credentials.bucket} with key ${credentials.key}: ${error instanceof Error ? error.message : String(error)}`);
            throw new BadRequestException(error instanceof Error ? error.message : String(error));
        }
    }

    async generateSignedUrl(
        credentials: AWS3SignedUrlConfig
    ) {
        const { accessKey, secretKey, region, bucket, key } = credentials;
        const s3 = this.getClient(accessKey, secretKey, region);

        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: key,
        });

        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
        this.logger.log(`Generated signed URL for bucket ${bucket} with key ${key}: ${signedUrl}`);
        return signedUrl;
    }
}
