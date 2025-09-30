import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { OwnerOrAdminGuard } from '../../common/guards/owner-or-admin.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Создать нового пользователя (только для администраторов)' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно создан', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return await this.usersService.create(createUserDto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Получить список всех пользователей (только для администраторов)' })
  @ApiResponse({ status: 200, description: 'Список пользователей', type: [UserResponseDto] })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  async findAll(): Promise<UserResponseDto[]> {
    return await this.usersService.findAll();
  }

  @UseGuards(OwnerOrAdminGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Получить информацию о пользователе по ID' })
  @ApiParam({ name: 'id', description: 'ID пользователя', type: 'number' })
  @ApiResponse({ status: 200, description: 'Информация о пользователе', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    return await this.usersService.findOne(id);
  }

  @UseGuards(OwnerOrAdminGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Обновить информацию о пользователе' })
  @ApiParam({ name: 'id', description: 'ID пользователя', type: 'number' })
  @ApiResponse({ status: 200, description: 'Пользователь успешно обновлен', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    return await this.usersService.update(id, updateUserDto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить пользователя (только для администраторов)' })
  @ApiParam({ name: 'id', description: 'ID пользователя', type: 'number' })
  @ApiResponse({ status: 204, description: 'Пользователь успешно удален' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.usersService.remove(id);
  }
}
