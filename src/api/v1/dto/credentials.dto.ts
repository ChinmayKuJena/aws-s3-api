import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ListObjectsDto {
    @IsNotEmpty()
    @IsString()
    bucket!: string;

    @IsOptional()
    @IsString()
    prefix?: string;
}

export class UploadObjectDto {
    @IsNotEmpty()
    @IsString()
    bucket!: string;

    @IsOptional()
    @IsString()
    key?: string;

    @IsOptional()
    @IsString()
    folder?: string;
}

export class DeleteObjectDto {
    @IsNotEmpty()
    @IsString()
    bucket!: string;

    @IsNotEmpty()
    @IsString()
    key!: string;
}

export class GetSignedUrlDto {
    @IsNotEmpty()
    @IsString()
    bucket!: string;

    @IsNotEmpty()
    @IsString()
    key!: string;
}

export class AiChatDto {
    @IsNotEmpty()
    @IsString()
    prompt!: string;
}
