import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as OSS from 'ali-oss'

@Injectable()
export class OssService {
  constructor(private readonly configService: ConfigService) {}

  async getOssSignature() {
    const region = this.configService.get<string>('OSS_REGION')
    const bucket = this.configService.get<string>('OSS_BUCKET')
    const accessKeyId = this.configService.get<string>('OSS_ACCESS_KEY_ID')
    const accessKeySecret = this.configService.get<string>('OSS_ACCESS_KEY_SECRET')

    // 初始化 OSS 客户端
    const client = new OSS({
      region,
      bucket,
      accessKeyId,
      accessKeySecret,
    })

    // 有效期为 6 小时
    const expireTime = new Date()
    expireTime.setSeconds(expireTime.getSeconds() + 3600 * 6)

    // 签名生成
    const signature = client.calculatePostSignature({
      expiration: expireTime.toISOString(),
      conditions: [
        ['content-length-range', 0, 1048576000], // 限制文件大小为 1GB
      ],
    })

    // 获取存储桶所在的地域
    const location = await client.getBucketLocation()

    // 构建上传地址
    const host = `http://${bucket}.${location.location}.aliyuncs.com`

    return {
      ...signature,
      host,
    }
  }
}
