import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Query,
    UseInterceptors,
    UploadedFile,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiV1Service } from './api-v1.service';
import {
    ListObjectsDto,
    UploadObjectDto,
    DeleteObjectDto,
    GetSignedUrlDto,
    AiChatDto,
} from './dto/credentials.dto';

@Controller('api/v1/s3')
export class ApiV1Controller {
    constructor(private readonly apiV1Service: ApiV1Service) { }

    @Post('chat')
    async aiChat(@Body() dto: AiChatDto) {
        return {
            success: true,
            data: await this.apiV1Service.aiS3Assistant(dto.prompt),
        };
    }

    @Get('buckets')
    async listBuckets() {
        return {
            success: true,
            data: await this.apiV1Service.listBuckets(),
        };
    }

    @Get('objects')
    async listObjects(@Query() dto: ListObjectsDto) {
        return {
            success: true,
            data: await this.apiV1Service.listObjects(dto),
        };
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadObject(
        @Body() dto: UploadObjectDto,
        @UploadedFile() file: any,
    ) {
        return {
            success: true,
            message: 'File uploaded successfully',
            data: await this.apiV1Service.uploadObject(dto, file),
        };
    }

    @Delete('object')
    @HttpCode(HttpStatus.OK)
    async deleteObject(@Body() dto: DeleteObjectDto) {
        return {
            success: true,
            message: 'Object deleted successfully',
            data: await this.apiV1Service.deleteObject(dto),
        };
    }

    @Post('signed-url')
    async getSignedUrl(@Body() dto: GetSignedUrlDto) {
        const url = await this.apiV1Service.getSignedUrl(dto);
        return {
            success: true,
            data: { url },
        };
    }
}
