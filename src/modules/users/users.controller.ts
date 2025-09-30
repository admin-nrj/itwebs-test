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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { OwnerOrAdminGuard } from '../../common/guards/owner-or-admin.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return await this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    return await this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard, OwnerOrAdminGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    return await this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, OwnerOrAdminGuard)
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    return await this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.usersService.remove(id);
  }
}
