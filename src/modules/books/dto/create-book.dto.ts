import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty({ message: 'Название книги не может быть пустым' })
  @MaxLength(200, { message: 'Название книги не может быть длиннее 200 символов' })
  title: string;
}
