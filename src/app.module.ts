import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { HotelsModule } from './modules/hotels/hotels.module';
import { ChatModule } from './modules/chat/chat.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    UsersModule,
    HotelsModule,
    ChatModule,
    MongooseModule.forRoot('mongodb://localhost:27017/hotels2'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
