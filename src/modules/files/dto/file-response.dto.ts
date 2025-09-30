import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FileResponseDto {
  @ApiProperty({ description: 'ID файла' })
  @Expose()
  fileId: number;

  @ApiProperty({ description: 'Путь к файлу' })
  @Expose()
  path: string;

  @ApiProperty({ description: 'Имя файла' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Дата создания' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления' })
  @Expose()
  updatedAt: Date;
}
