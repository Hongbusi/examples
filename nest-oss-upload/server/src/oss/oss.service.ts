import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as OSS from 'ali-oss'

@Injectable()
export class OssService {
  private readonly client: OSS

  constructor(private readonly configService: ConfigService) {
    const region = this.configService.get<string>('OSS_REGION')
    const bucket = this.configService.get<string>('OSS_BUCKET')
    const accessKeyId = this.configService.get<string>('OSS_ACCESS_KEY_ID')
    const accessKeySecret = this.configService.get<string>('OSS_ACCESS_KEY_SECRET')

    // 初始化 OSS
    this.client = new OSS({
      region,
      bucket,
      accessKeyId,
      accessKeySecret,
    })
  }

  async getOssSignature() {
    // 有效期为 6 小时
    const expireTime = new Date()
    expireTime.setSeconds(expireTime.getSeconds() + 3600 * 6)

    // 签名生成
    const signature = this.client.calculatePostSignature({
      expiration: expireTime.toISOString(),
      conditions: [
        ['content-length-range', 0, 1048576000], // 限制文件大小为 1GB
      ],
    })

    // 获取存储桶所在的地域
    const location = await this.client.getBucketLocation()

    // 构建上传地址
    const host = `https://${this.client.options.bucket}.${location.location}.aliyuncs.com`

    return {
      ...signature,
      host,
    }
  }

  async getPrivateFileTemporaryUrl(objectKey: string): Promise<string> {
    try {
      // 生成用于访问私有文件的临时 url
      const url = this.client.signatureUrl(objectKey, { expires: 3600 }) // url 有效期为1小时
      return url
    }
    catch (error) {
      throw new NotFoundException('文件未找到')
    }
  }
}
