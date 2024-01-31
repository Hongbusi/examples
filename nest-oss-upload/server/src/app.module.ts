import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { OssModule } from './oss/oss.module'
import * as Joi from 'joi'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        OSS_REGION: Joi.string().required(),
        OSS_BUCKET: Joi.string().required(),
        OSS_ACCESS_KEY_ID: Joi.string().required(),
        OSS_ACCESS_KEY_SECRET: Joi.string().required(),
      }),
    }),
    OssModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
