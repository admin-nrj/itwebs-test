import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly messagesGateway: MessagesGateway,
  ) {}

  @Get()
  getAllMessages() {
    return this.messagesService.findAll();
  }

  @Get(':id')
  async getMessageById(@Param('id', ParseIntPipe) id: number) {
    const message = await this.messagesService.findOne(id);
    if (!message) {
      throw new NotFoundException(`Сообщение с ID ${id} не найдено`);
    }
    return message;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createMessage(@Body() createMessageDto: CreateMessageDto) {
    const message = this.messagesService.create(createMessageDto);

    this.messagesGateway.server.emit('newMessage', message);

    return message;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMessage(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.messagesService.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Сообщение с ID ${id} не найдено`);
    }
  }
}
