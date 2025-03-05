import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  Injectable,
  InternalServerErrorException,
  LoggerService,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

import axios from 'axios';
import { PrismaService } from '../database/prisma.service';
import { UploadFileDto } from './dtos/upload.dto';

@Injectable()
export class BucketService {
  PUBLIC_BUCKET: string;
  PRIVATE_BUCKET: string;
  REGION: string;
  s3: S3Client;

  constructor(
    private readonly configService: ConfigService,
    private readonly databaseService: PrismaService,
    private readonly logger: LoggerService,
  ) {
    const {
      region,
      accessKeyId,
      publicBucket,
      privateBucket,
      secretAccessKey,
    } = this.configService.get<EnvironmentConfig['aws']>('aws');

    this.PUBLIC_BUCKET = publicBucket;
    this.PRIVATE_BUCKET = privateBucket;
    this.REGION = region;
    this.s3 = new S3Client({
      region,
      apiVersion: '2006-03-01',
      credentials: { accessKeyId, secretAccessKey },
      logger,
    });
  }

  buildFileKey(filename: string) {
    return `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.]/g, '')}`;
  }

  buildPublicS3Url(key: string) {
    return `https://${this.PUBLIC_BUCKET}.s3.${this.REGION}.amazonaws.com/${key}`;
  }

  async upload({ file, isPublic }: { file: UploadFileDto; isPublic: boolean }) {
    const allowedMimes = [
      'image/jpeg',
      'image/pjpeg',
      'image/png',
      'image/gif',
      'image/svg+xml',
      'image/webp',
      'application/pdf',
      'image/jpg',
      'image/jpge',
      'image/heic',
    ];

    if (!file || !allowedMimes.includes(file.mimetype)) {
      this.logger.error(`Invalid file type to upload: ${file.mimetype}`);
      throw new UnsupportedMediaTypeException(exceptions.files.invalidType);
    }

    const key = this.buildFileKey(file.originalname);
    this.logger.log(
      `Uploading file public=${isPublic} to S3: ${key} - size:${file.size}mb`,
    );

    const url = isPublic ? this.buildPublicS3Url(key) : '';

    try {
      const uploadCommand = new PutObjectCommand({
        Key: key,
        Bucket: isPublic ? this.PUBLIC_BUCKET : this.PRIVATE_BUCKET,
        Body: file.buffer,
        ContentType: file.mimetype,
      });
      await this.s3.send(uploadCommand);
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw new InternalServerErrorException(exceptions.files.upload);
    }
  }

  async download(key: string) {
    this.logger.log(`Downloading file from S3: ${key}`);

    try {
      const downloadCommand = new GetObjectCommand({
        Bucket: this.PRIVATE_BUCKET,
        Key: key,
      });

      const url = await getSignedUrl(this.s3, downloadCommand, {
        expiresIn: 60 * 60 * 24, // 24 hours
      });

      const download = await axios.get(url, { responseType: 'stream' });
      return await streamToBuffer(download.data as Readable);
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw new InternalServerErrorException(exceptions.files.download);
    }
  }

  async delete({ key, isPublic }: { key: string; isPublic: boolean }) {
    this.logger.log(`Removing file from S3: ${key} public=${isPublic}`);

    try {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: isPublic ? this.PUBLIC_BUCKET : this.PRIVATE_BUCKET,
          Key: key,
        }),
      );

      await this.databaseService.bucket.update({
        where: { key },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw new InternalServerErrorException(exceptions.files.delete);
    }
  }

  async batchUploadPublic(files: UploadFileDto[]) {
    const filesUploaded = files.map(async (file) => {
      return await this.upload({ file, isPublic: true });
    });

    return Promise.all(filesUploaded);
  }

  async batchDeletePublic(keys: string[]) {
    this.logger.log(`Removing files from S3: ${keys}`);

    try {
      await this.s3.send(
        new DeleteObjectsCommand({
          Bucket: this.PUBLIC_BUCKET,
          Delete: { Objects: keys.map((key) => ({ Key: key })) },
        }),
      );

      await this.databaseService.bucket.updateMany({
        where: { key: { in: keys } },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      throw new InternalServerErrorException(exceptions.files.delete);
    }
  }
}
