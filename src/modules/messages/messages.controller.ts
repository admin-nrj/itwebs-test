import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import type { AuthUser } from '../auth/interfaces/auth-user.interface';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly messagesGateway: MessagesGateway,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllMessages() {
    return this.messagesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getMessageById(@Param('id', ParseIntPipe) id: number) {
    const message = await this.messagesService.findOne(id);
    if (!message) {
      throw new NotFoundException(`Сообщение с ID ${id} не найдено`);
    }
    return message;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createMessage(@Body() createMessageDto: CreateMessageDto, @CurrentUser() user: AuthUser) {
    const message = await this.messagesService.create(createMessageDto.text, user.userId);

    this.messagesGateway.server.emit('newMessage', message);

    return message;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMessage(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.messagesService.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Сообщение с ID ${id} не найдено`);
    }
  }
}
