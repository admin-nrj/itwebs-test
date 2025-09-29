import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];

  private readonly maxSize = 5 * 1024 * 1024; // 5MB

  transform(file: Express.Multer.File): Express.Multer.File {
    if (!file) {
      throw new BadRequestException('Файл не был загружен');
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Допустимы только изображения (JPEG, PNG, GIF, WebP) и PDF файлы');
    }

    if (file.size > this.maxSize) {
      throw new BadRequestException('Размер файла не должен превышать 5MB');
    }

    return file;
  }
}
