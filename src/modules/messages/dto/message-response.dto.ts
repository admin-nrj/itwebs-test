import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
  @ApiProperty({ description: 'ID сообщения' })
  @Expose()
  messageId: number;

  @ApiProperty({ description: 'Текст сообщения' })
  @Expose()
  text: string;

  @ApiProperty({ description: 'ID пользователя' })
  @Expose()
  userId: number;

  @ApiProperty({ description: 'Дата создания' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления' })
  @Expose()
  updatedAt: Date;
}
