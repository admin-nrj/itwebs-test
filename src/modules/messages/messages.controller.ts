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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import type { AuthUser } from '../auth/interfaces/auth-user.interface';

@ApiTags('Messages')
@ApiBearerAuth()
@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly messagesGateway: MessagesGateway,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Получить все сообщения' })
  @ApiResponse({ status: 200, description: 'Список сообщений', type: [MessageResponseDto] })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  getAllMessages() {
    return this.messagesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить сообщение по ID' })
  @ApiParam({ name: 'id', description: 'ID сообщения', type: 'number' })
  @ApiResponse({ status: 200, description: 'Информация о сообщении', type: MessageResponseDto })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Сообщение не найдено' })
  async getMessageById(@Param('id', ParseIntPipe) id: number) {
    const message = await this.messagesService.findOne(id);
    if (!message) {
      throw new NotFoundException(`Сообщение с ID ${id} не найдено`);
    }
    return message;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Создать новое сообщение' })
  @ApiResponse({ status: 201, description: 'Сообщение успешно создано', type: MessageResponseDto })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async createMessage(@Body() createMessageDto: CreateMessageDto, @CurrentUser() user: AuthUser) {
    const message = await this.messagesService.create(createMessageDto.text, user.userId);

    this.messagesGateway.server.emit('newMessage', message);

    return message;
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить сообщение (только для администраторов)' })
  @ApiParam({ name: 'id', description: 'ID сообщения', type: 'number' })
  @ApiResponse({ status: 204, description: 'Сообщение успешно удалено' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Сообщение не найдено' })
  async deleteMessage(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.messagesService.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Сообщение с ID ${id} не найдено`);
    }
  }
}
