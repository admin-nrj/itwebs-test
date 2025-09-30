import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  // https://en.wikipedia.org/wiki/List_of_file_signatures
  private readonly allowedHeaderSignaturesMap = {
    png: Buffer.from(['89', '50', '4E', '47', '0D', '0A', '1A', '0A'].join(''), 'hex'),
    jpgJFIF: Buffer.from(['FF', 'D8', 'FF', 'E0', '00', '10', '4A', '46', '49', '46', '00', '01'].join(''), 'hex'),
    jpgRaw: Buffer.from(['FF', 'D8', 'FF', 'DB'].join(''), 'hex'),
    jpeg: Buffer.from(['FF', 'D8', 'FF', 'EE'].join(''), 'hex'),
    jpegJFIF: Buffer.from(['FF', 'D8', 'FF', 'E1'].join(''), 'hex'),
    jpg: Buffer.from(['FF', 'D8', 'FF', 'E0'].join(''), 'hex'),
    gif1: Buffer.from(['47', '49', '46', '38', '37', '61'].join(''), 'hex'),
    gif2: Buffer.from(['47', '49', '46', '38', '39', '61'].join(''), 'hex'),
    pdf: Buffer.from(['25', '50', '44', '46', '2D'].join(''), 'hex'),
  };

  private readonly maxSize = 5 * 1024 * 1024; // 5MB

  transform(file: Express.Multer.File): Express.Multer.File {
    if (!file) {
      throw new BadRequestException('Файл не был загружен');
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Допустимы только изображения (JPEG, PNG, GIF) и PDF файлы');
    }

    if (file.size > this.maxSize) {
      throw new BadRequestException('Размер файла не должен превышать 5MB');
    }

    if (!this.isAllowedFileSignature(file)) {
      throw new BadRequestException('Неизвестный тип файла');
    }

    return file;
  }

  private isAllowedFileSignature(file: Express.Multer.File) {
    return Object.values(this.allowedHeaderSignaturesMap).some((signatureBuffer) => {
      const fileBufferHeader = file.buffer.subarray(0, signatureBuffer.length);

      return Buffer.compare(fileBufferHeader, signatureBuffer) === 0;
    });
  }
}
