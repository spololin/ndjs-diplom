import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { HotelsModule } from './modules/hotels/hotels.module';
import { ReservationsService } from './modules/reservations/reservations.service';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { ChatController } from './modules/chat/chat.controller';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [UsersModule, HotelsModule, ReservationsModule, ChatModule],
  controllers: [AppController, ChatController],
  providers: [AppService, ReservationsService],
})
export class AppModule {}
