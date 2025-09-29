import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';

@Controller('books')
export class BooksController {
  @Get()
  getAllBooks() {
    return [
      { id: 1, title: 'Война и мир' },
      { id: 2, title: 'Преступление и наказание' },
    ];
  }

  @Get('search')
  searchBooks(@Query('title') title: string) {
    return `Поиск книг по названию: ${title}`;
  }

  @Get(':id')
  getBook(@Param('id') id: string) {
    return { id, title: 'Найденная книга' };
  }

  @Post()
  createBook(@Body() createBookDto: CreateBookDto) {
    return { message: 'Книга создана', data: createBookDto };
  }
}
