import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { HotelsModule } from './modules/hotels/hotels.module';
import { ReservationsService } from './modules/reservations/reservations.service';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { ChatController } from './modules/chat/chat.controller';
import { ChatModule } from './modules/chat/chat.module';
import { RoomsService } from './modules/rooms/rooms.service';
import { RoomsModule } from './modules/rooms/rooms.module';

@Module({
  imports: [
    UsersModule,
    HotelsModule,
    ReservationsModule,
    ChatModule,
    RoomsModule,
  ],
  controllers: [AppController, ChatController],
  providers: [AppService, ReservationsService, RoomsService],
})
export class AppModule {}
