import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class UiController {
    @Get()
    @Render('index')
    root() {
        return {
            layout: 'layouts/main',
            title: 'Dashboard',
            pageDescription: 'Overview of your AWS S3 storage',
            isDashboard: true,
        };
    }

    @Get('buckets')
    @Render('buckets')
    bucketsPage() {
        return {
            layout: 'layouts/main',
            title: 'Buckets',
            pageDescription: 'View and manage your S3 buckets',
            isBuckets: true,
        };
    }

    @Get('objects')
    @Render('objects')
    objectsPage() {
        return {
            layout: 'layouts/main',
            title: 'Objects',
            pageDescription: 'Browse objects in your buckets',
            isObjects: true,
        };
    }

    @Get('upload')
    @Render('upload')
    uploadPage() {
        return {
            layout: 'layouts/main',
            title: 'Upload File',
            pageDescription: 'Upload files to your S3 buckets',
            isUpload: true,
        };
    }

    @Get('delete')
    @Render('delete')
    deletePage() {
        return {
            layout: 'layouts/main',
            title: 'Delete Object',
            pageDescription: 'Remove objects from your buckets',
            isDelete: true,
        };
    }

    @Get('signed-url')
    @Render('signed-url')
    signedUrlPage() {
        return {
            layout: 'layouts/main',
            title: 'Signed URL',
            pageDescription: 'Generate temporary access URLs',
            isSignedUrl: true,
        };
    }
}
