import { Controller, Get, Post, Delete, Body, Param, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './nestjs_gateway';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly messagesGateway: MessagesGateway,
  ) {}

  @Get()
  getAllMessages() {
    return {
      success: true,
      data: this.messagesService.findAll(),
    };
  }

  @Get(':id')
  getMessageById(@Param('id') id: string) {
    const message = this.messagesService.findOne(+id);
    if (!message) {
      throw new NotFoundException(`Сообщение с ID ${id} не найдено`);
    }
    return {
      success: true,
      data: message,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createMessage(@Body() body: { text: string; author: string }) {
    const message = this.messagesService.create(body.text, body.author);

    this.messagesGateway.server.emit('newMessage', message);

    return {
      success: true,
      data: message,
      message: 'Сообщение успешно создано',
    };
  }

  @Delete(':id')
  deleteMessage(@Param('id') id: string) {
    const deleted = this.messagesService.delete(+id);
    if (!deleted) {
      throw new NotFoundException(`Сообщение с ID ${id} не найдено`);
    }
    return {
      success: true,
      message: 'Сообщение успешно удалено',
    };
  }
}
