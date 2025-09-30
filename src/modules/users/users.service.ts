import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import { User } from './entities/user.entity';
import type { UsersRepositoryInterface } from '../../dal/interfaces/users-repository.interface';
import { USERS_REPOSITORY_TOKEN } from '../../dal/tokens/repository.tokens';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { CryptoService } from '../../common/crypto/crypto.service';
import { toDto, toDtoArray } from '../../common/utils/dto.util';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY_TOKEN)
    private readonly usersRepository: UsersRepositoryInterface,
    private readonly cryptoService: CryptoService,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.usersRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException(`Пользователь с email ${createUserDto.email} уже существует`);
    }

    const user = await this.usersRepository.create({
      ...createUserDto,
      password: await this.cryptoService.hashPassword(createUserDto.password),
    } as User);

    return toDto(UserResponseDto, user);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.findAll();
    return toDtoArray(UserResponseDto, users);
  }

  async findOne(userId: number): Promise<UserResponseDto> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${userId} не найден`);
    }
    return toDto(UserResponseDto, user);
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
      updateData.password = await this.cryptoService.hashPassword(updateUserDto.password);
    }

    const updatedUser = await this.usersRepository.updateUser(userId, updateData);
    return toDto(UserResponseDto, updatedUser!);
  }

  async remove(userId: number): Promise<void> {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${userId} не найден`);
    }

    await this.usersRepository.updateUser(userId, { ...user, isActive: false });
  }
}
