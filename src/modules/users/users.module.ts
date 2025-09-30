import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DalModule } from '../../dal';
import { CryptoModule } from '../../common/crypto/crypto.module';

@Module({
  imports: [DalModule, CryptoModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
