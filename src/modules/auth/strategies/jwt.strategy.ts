import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { ConfigType } from '@nestjs/config';
import type { UsersRepositoryInterface } from '../../../dal/interfaces/users-repository.interface';
import { USERS_REPOSITORY_TOKEN } from '../../../dal/tokens/repository.tokens';
import { AuthUser } from '../interfaces/auth-user.interface';
import jwtConfig from '../../../config/jwt.config';

export interface JwtPayload {
  sub: number;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY)
    private jwt: ConfigType<typeof jwtConfig>,
    @Inject(USERS_REPOSITORY_TOKEN)
    private readonly usersRepository: UsersRepositoryInterface,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwt.secret,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthUser> {
    const user = await this.usersRepository.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Учетная запись деактивирована');
    }

    return {
      userId: user.userId,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
