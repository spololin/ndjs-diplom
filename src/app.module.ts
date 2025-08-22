import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { HotelsModule } from './modules/hotels/hotels.module';
import { ReservationsService } from './modules/reservations/reservations.service';
import { ReservationsModule } from './modules/reservations/reservations.module';

@Module({
  imports: [UsersModule, HotelsModule, ReservationsModule],
  controllers: [AppController],
  providers: [AppService, ReservationsService],
})
export class AppModule {}
