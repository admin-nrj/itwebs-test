import { Injectable, UnauthorizedException, ConflictException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { ConfigType } from '@nestjs/config';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import { JwtRefreshPayload } from './strategies/jwt-refresh.strategy';
import { AuthUser } from './interfaces/auth-user.interface';
import { UserRole } from '../../common/enums/user-role.enum';
import { CryptoService } from '../../common/crypto/crypto.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import jwtConfig from '../../config/jwt.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly cryptoService: CryptoService,
    @Inject(jwtConfig.KEY)
    private readonly jwt: ConfigType<typeof jwtConfig>,
  ) {}

  async validateUser(email: string, password: string): Promise<AuthUser | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Учетная запись деактивирована');
    }

    const isPasswordValid = await this.cryptoService.comparePassword(password, user.password);

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

  private generateTokens(user: { userId: number; email: string; name: string; role: UserRole }) {
    const accessPayload: JwtPayload = {
      sub: user.userId,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const refreshPayload: JwtRefreshPayload = {
      sub: user.userId,
      email: user.email,
    };

    return {
      accessToken: this.jwtService.sign(accessPayload, {
        secret: this.jwt.secret,
        expiresIn: this.jwt.expiresIn,
      }),
      refreshToken: this.jwtService.sign(refreshPayload, {
        secret: this.jwt.refreshSecret,
        expiresIn: this.jwt.refreshExpiresIn,
      }),
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const createUserDto: CreateUserDto = {
      name: registerDto.email.split('@')[0],
      email: registerDto.email,
      password: registerDto.password,
      role: UserRole.USER,
    };

    let userDto: UserResponseDto;
    try {
      userDto = await this.usersService.create(createUserDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new ConflictException(`Пользователь с email ${registerDto.email} уже существует`);
    }

    const tokens = this.generateTokens(userDto);

    return {
      ...tokens,
      user: {
        userId: userDto.userId,
        email: userDto.email,
        name: userDto.name,
        role: userDto.role,
      },
    };
  }

  login(user: AuthUser): AuthResponseDto {
    const tokens = this.generateTokens(user);

    return {
      ...tokens,
      user: {
        userId: user.userId,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async refreshTokens(userId: number, email: string): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmail(email);

    if (!user || user.userId !== userId) {
      throw new UnauthorizedException('Невалидный refresh токен');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Учетная запись деактивирована');
    }

    const tokens = this.generateTokens({
      userId: user.userId,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return {
      ...tokens,
      user: {
        userId: user.userId,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
