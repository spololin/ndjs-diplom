import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { HotelsModule } from './modules/hotels/hotels.module';
import { ChatModule } from './modules/chat/chat.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    UsersModule,
    HotelsModule,
    ChatModule,
    UsersModule,
    AuthModule,
    MongooseModule.forRoot('mongodb://localhost:27017/hotels2'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
