import { Module } from '@nestjs/common';
import { AwsS3Module } from './aws-s3/aws-s3.module';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from './api/api.module';
import { UiModule } from './ui/ui.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { APP_FILTER } from '@nestjs/core/constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AwsS3Module,
    ApiModule,
    UiModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter
    },
    //  {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard
    // }
  ],
})
export class AppModule { }
