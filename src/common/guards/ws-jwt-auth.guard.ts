import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { ConfigType } from '@nestjs/config';
import { Socket } from 'socket.io';
import type { UsersRepositoryInterface } from '../../dal/interfaces/users-repository.interface';
import { USERS_REPOSITORY_TOKEN } from '../../dal/tokens/repository.tokens';
import { AuthUser } from '../../modules/auth/interfaces/auth-user.interface';
import jwtConfig from '../../config/jwt.config';

interface JwtPayload {
  sub: number;
  email: string;
  name: string;
  role: string;
}

interface SocketWithAuth extends Socket {
  data: {
    user?: AuthUser;
  };
}

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  constructor(
    @Inject(jwtConfig.KEY)
    private jwt: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
    @Inject(USERS_REPOSITORY_TOKEN)
    private readonly usersRepository: UsersRepositoryInterface,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<SocketWithAuth>();
    const token = this.extractTokenFromHandshake(client);

    if (!token) {
      throw new UnauthorizedException('Токен не предоставлен');
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: this.jwt.secret,
      });

      const user = await this.usersRepository.findById(payload.sub);

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Пользователь не найден или деактивирован');
      }

      // Сохраняем пользователя в данных сокета
      client.data.user = {
        userId: user.userId,
        email: user.email,
        name: user.name,
        role: user.role,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Неверный токен');
    }
  }

  private extractTokenFromHandshake(client: Socket): string | null {
    const authHeader = client.handshake.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    const authToken: unknown = client.handshake.auth?.token;
    const queryToken: unknown = client.handshake.query?.token;

    if (typeof authToken === 'string') {
      return authToken;
    }

    if (typeof queryToken === 'string') {
      return queryToken;
    }

    return null;
  }
}
