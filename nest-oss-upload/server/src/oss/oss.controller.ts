import { Controller, Get, Param } from '@nestjs/common'
import { OssService } from './oss.service'

@Controller('oss')
export class OssController {
  constructor(private readonly ossService: OssService) {}

  @Get('signature')
  getOssSignature(): any {
    return this.ossService.getOssSignature()
  }

  @Get('file/:objectKey')
  async getPrivateFileTemporaryUrl(@Param('objectKey') objectKey: string) {
    return await this.ossService.getPrivateFileTemporaryUrl(objectKey)
  }
}
