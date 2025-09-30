import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { UsersRepository } from '../../dal/repositories/users.repository';
import { USERS_REPOSITORY_TOKEN } from '../../dal/tokens/repository.tokens';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/entities/user.entity';
import jwtConfig from '../../config/jwt.config';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (jwt: ConfigType<typeof jwtConfig>) => ({
        secret: jwt.secret,
        signOptions: { expiresIn: jwt.expiresIn },
      }),
      inject: [jwtConfig.KEY],
    }),
    SequelizeModule.forFeature([User]),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: USERS_REPOSITORY_TOKEN,
      useClass: UsersRepository,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
