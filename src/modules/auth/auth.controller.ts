import { Controller, Post, UseGuards, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthUser } from './interfaces/auth-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@CurrentUser() user: AuthUser): Promise<AuthResponseDto> {
    return this.authService.login(user);
  }
}
