import { Bucket, _Object } from "@aws-sdk/client-s3";
export interface AWS3ConfigBase {
    accessKey: string;
    secretKey: string;
    region: string;
}
export interface AWS3UploadConfig extends AWS3ConfigBase {
    bucket: string;
    body: Buffer;
    key: string;
}
export interface AWS3SignedUrlConfig extends AWS3ConfigBase {
    bucket: string;
    key: string;
}
export interface AWS3DeleteConfig extends AWS3ConfigBase {
    bucket: string;
    key: string;
}
export interface AWS3ListBucketsConfig extends AWS3ConfigBase {
    bucket: string;
    prefix?: string;
}

export interface AWS3Bucket extends Bucket { }

export interface AWS3Object extends _Object { }