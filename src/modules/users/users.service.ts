import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import { User } from './entities/user.entity';
import type { UsersRepositoryInterface } from '../../dal/interfaces/users-repository.interface';
import { USERS_REPOSITORY_TOKEN } from '../../dal/tokens/repository.tokens';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import * as bcrypt from 'bcrypt';
const saltRounds = 10;

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY_TOKEN)
    private readonly usersRepository: UsersRepositoryInterface,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.usersRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException(`Пользователь с email ${createUserDto.email} уже существует`);
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const user = await this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    } as User);

    return this.toResponseDto(user);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.findAll();
    return users.map((user) => this.toResponseDto(user));
  }

  async findOne(userId: number): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${userId} не найден`);
    }
    return this.toResponseDto(user);
  }

  async update(userId: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${userId} не найден`);
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException(`Пользователь с email ${updateUserDto.email} уже существует`);
      }
    }

    const updateData: Partial<User> = { ...updateUserDto };
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateData.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    const updatedUser = await this.usersRepository.updateUser(userId, updateData);
    return this.toResponseDto(updatedUser!);
  }

  async remove(userId: number): Promise<void> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${userId} не найден`);
    }

    await this.usersRepository.delete(userId);
  }

  private toResponseDto(user: User): UserResponseDto {
    return {
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
