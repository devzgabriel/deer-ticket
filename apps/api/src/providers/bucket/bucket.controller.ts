import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
} from '@nestjs/common';
import { Response } from 'express';

import { BucketService } from './bucket.service';
import { UploadFileDto } from './dtos/upload.dto';
import { UploadRoute } from './uploadRoute.decorator';

@Controller('files')
export class BucketController {
  constructor(private readonly bucketService: BucketService) {}

  @Post('/')
  @UploadRoute()
  async uploadPrivateFile(@UploadedFile() file: UploadFileDto) {
    return this.bucketService.upload({ file, isPublic: false });
  }

  @Get('/:key')
  async downloadPrivate(@Res() res: Response, @Param('key') key: string) {
    if (!key) {
      throw new BadRequestException();
    }

    const buffer = await this.bucketService.download(key);

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=${key}`);
    res.send(buffer);
  }
}
