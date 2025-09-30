import { Injectable, Inject, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { ConfigType } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import type { UsersRepositoryInterface } from '../../dal/interfaces/users-repository.interface';
import { USERS_REPOSITORY_TOKEN } from '../../dal/tokens/repository.tokens';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import { AuthUser } from './interfaces/auth-user.interface';
import { UserRole } from '../../common/enums/user-role.enum';
import { User } from '../users/entities/user.entity';
import appConfig from '../../config/app.config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USERS_REPOSITORY_TOKEN)
    private readonly usersRepository: UsersRepositoryInterface,
    private readonly jwtService: JwtService,
    @Inject(appConfig.KEY)
    private app: ConfigType<typeof appConfig>,
  ) {}

  async validateUser(email: string, password: string): Promise<AuthUser | null> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Учетная запись деактивирована');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return {
      userId: user.userId,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.usersRepository.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException(`Пользователь с email ${registerDto.email} уже существует`);
    }

    const salt = await bcrypt.genSalt(this.app.bcryptSaltRounds);
    const hashedPassword = await bcrypt.hash(registerDto.password, salt);

    const user = await this.usersRepository.create({
      name: registerDto.email.split('@')[0],
      email: registerDto.email,
      password: hashedPassword,
      role: UserRole.USER,
      isActive: true,
    } as User);

    const payload: JwtPayload = {
      sub: user.userId,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        userId: user.userId,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async login(user: AuthUser): Promise<AuthResponseDto> {
    const payload: JwtPayload = {
      sub: user.userId,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return Promise.resolve({
      accessToken: this.jwtService.sign(payload),
      user: {
        userId: user.userId,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  }
}
