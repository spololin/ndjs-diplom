import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [UsersModule],
  providers: [],
  exports: [],
  controllers: [AuthController],
})
export class AuthModule {}
