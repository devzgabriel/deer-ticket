import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';

/**
 * Upload Route Decorator
 */
export function UploadRoute(files: number = 1): MethodDecorator {
  const limits = { fileSize: 500000, files }; // For multipart forms, the max file size (in bytes)(Default: Infinity)

  return applyDecorators(
    UseInterceptors(
      files > 1
        ? AnyFilesInterceptor({ limits })
        : FileInterceptor('file', { limits }),
    ),
  );
}
