import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AwsS3Service } from '../../aws-s3/services/aws-s3.service';
import {
    ListObjectsDto,
    UploadObjectDto,
    DeleteObjectDto,
    GetSignedUrlDto,
} from './dto/credentials.dto';
import { AWS3ConfigBase } from 'src/aws-s3/aws-s3.modles';
import Groq from "groq-sdk";

@Injectable()
export class ApiV1Service {
    private readonly logger = new Logger(ApiV1Service.name);
    private groq: Groq;

    constructor(
        private readonly awsS3Service: AwsS3Service,
        private readonly configService: ConfigService,
    ) {
        this.groq = new Groq({
            apiKey: this.configService.get<string>('GROQ_API_KEY'),
        });
    }

    private getCredentials() {
        return {
            accessKey: this.configService.get<string>('AWS_ACCESS_KEY_ID') ?? '',
            secretKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY') ?? '',
            region: this.configService.get<string>('AWS_REGION') ?? 'us-east-1',
        };
    }

    async aiS3Assistant(userPrompt: string) {
        this.logger.log(`Received AI chat prompt: ${userPrompt}`);
        const credentials = this.getCredentials();
        const tools: any[] = [
            {
                type: "function",
                function: {
                    name: "list_buckets",
                    description: "List all S3 buckets",
                    parameters: {
                        type: "object",
                        properties: {},
                    },
                },
            },
            {
                type: "function",
                function: {
                    name: "list_objects",
                    description: "List objects in a bucket",
                    parameters: {
                        type: "object",
                        properties: {
                            bucket: { type: "string" },
                            prefix: { type: "string" },
                        },
                        required: ["bucket"],
                    },
                },
            },
            {
                type: "function",
                function: {
                    name: "delete_object",
                    description: "Delete object from bucket",
                    parameters: {
                        type: "object",
                        properties: {
                            bucket: { type: "string" },
                            key: { type: "string" },
                        },
                        required: ["bucket", "key"],
                    },
                },
            },
            {
                type: "function",
                function: {
                    name: "generate_signed_url",
                    description: "Generate download URL for file",
                    parameters: {
                        type: "object",
                        properties: {
                            bucket: { type: "string" },
                            key: { type: "string" },
                        },
                        required: ["bucket", "key"],
                    },
                },
            },
        ];

        const completion = await this.groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are an AWS S3 assistant that manages buckets and files.",
                },
                {
                    role: "user",
                    content: userPrompt,
                },
            ],
            tools,
            tool_choice: "auto",
        });

        const message = completion.choices[0].message;
        this.logger.log(`AI Response: ${JSON.stringify(message)}`);
        if (!message.tool_calls) {
            return message.content;
        }

        const toolCall = message.tool_calls[0];
        const args = JSON.parse(toolCall.function.arguments);

        switch (toolCall.function.name) {
            case "list_buckets":
                return this.awsS3Service.listBuckets(credentials);

            case "list_objects":
                return this.awsS3Service.listObjects({
                    ...credentials,
                    bucket: args.bucket,
                    prefix: args.prefix,
                });

            case "delete_object":
                return this.awsS3Service.deleteObject({
                    ...credentials,
                    bucket: args.bucket,
                    key: args.key,
                });

            case "generate_signed_url":
                return this.awsS3Service.generateSignedUrl({
                    ...credentials,
                    bucket: args.bucket,
                    key: args.key,
                });

            default:
                throw new BadRequestException("Unknown tool call");
        }
    }
    async listBuckets() {
        this.logger.log('Listing all buckets');
        const credentials = this.getCredentials();
        return await this.awsS3Service.listBuckets(credentials);
    }

    async listObjects(dto: ListObjectsDto) {
        this.logger.log(`Listing objects in bucket: ${dto.bucket}`);
        const credentials = this.getCredentials();
        return await this.awsS3Service.listObjects({ ...credentials, ...dto });
    }

    async uploadObject(dto: UploadObjectDto, file: any) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        this.logger.log(`Uploading file to bucket: ${dto.bucket}`);
        const credentials = this.getCredentials();

        // Construct the key with folder if provided
        const key = dto.folder
            ? `${dto.folder}/${dto.key || file.originalname}`
            : (dto.key || file.originalname);

        return await this.awsS3Service.uploadObject({
            ...credentials,
            bucket: dto.bucket,
            key,
            body: file.buffer,
        });
    }

    async deleteObject(dto: DeleteObjectDto) {
        this.logger.log(`Deleting object: ${dto.key} from bucket: ${dto.bucket}`);
        const credentials = this.getCredentials();
        return await this.awsS3Service.deleteObject({ ...credentials, ...dto });
    }

    async getSignedUrl(dto: GetSignedUrlDto) {
        this.logger.log(`Generating signed URL for: ${dto.key} in bucket: ${dto.bucket}`);
        const credentials = this.getCredentials();
        return await this.awsS3Service.generateSignedUrl({ ...credentials, ...dto });
    }
}
