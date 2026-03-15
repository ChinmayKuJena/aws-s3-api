import { Module } from '@nestjs/common';
import { ApiV1Controller } from './api-v1.controller';
import { ApiV1Service } from './api-v1.service';
import { AwsS3Module } from '../../aws-s3/aws-s3.module';

@Module({
    imports: [AwsS3Module],
    controllers: [ApiV1Controller],
    providers: [ApiV1Service],
})
export class ApiV1Module { }
