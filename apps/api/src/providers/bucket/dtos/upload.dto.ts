import { IsNumber, IsString } from 'class-validator';
import fs from 'fs';

export class UploadFileDto {
  buffer: Buffer | fs.ReadStream;

  @IsString()
  mimetype?: string;

  @IsString()
  originalname: string;

  @IsNumber()
  size: number;

  bucket?: string;
  key?: string;
}
