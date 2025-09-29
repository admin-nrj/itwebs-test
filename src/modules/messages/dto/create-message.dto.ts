import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty({ message: 'Текст сообщения не может быть пустым' })
  @MaxLength(1000, { message: 'Сообщение не может быть длиннее 1000 символов' })
  text: string;

  @IsString()
  @IsNotEmpty({ message: 'Автор не может быть пустым' })
  @MaxLength(50, { message: 'Имя автора не может быть длиннее 50 символов' })
  author: string;
}
