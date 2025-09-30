import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import { AuthUser } from './interfaces/auth-user.interface';
import { UserRole } from '../../common/enums/user-role.enum';
import { CryptoService } from '../../common/crypto/crypto.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly cryptoService: CryptoService,
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

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const createUserDto: CreateUserDto = {
      name: registerDto.email.split('@')[0],
      email: registerDto.email,
      password: registerDto.password,
      role: UserRole.USER,
    };

    let userDto;
    try {
      userDto = await this.usersService.create(createUserDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new ConflictException(`Пользователь с email ${registerDto.email} уже существует`);
    }

    const payload: JwtPayload = {
      sub: userDto.userId,
      email: userDto.email,
      name: userDto.name,
      role: userDto.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        userId: userDto.userId,
        email: userDto.email,
        name: userDto.name,
        role: userDto.role,
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
