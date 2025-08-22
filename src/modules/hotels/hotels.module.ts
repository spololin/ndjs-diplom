import { Module } from '@nestjs/common';
import { HotelsController } from './hotels.controller';
import { HotelsService } from './hotels.service';
import { RoomsController } from '../rooms/rooms.controller';
import { RoomsService } from '../rooms/rooms.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservationsController } from '../reservations/reservations.controller';
import { ReservationsService } from '../reservations/reservations.service';
import { Hotel, HotelSchema } from '../../schemas/hotel.schema';
import { HotelRoom, RoomSchema } from '../../schemas/rooms.schema';
import {
  Reservation,
  ReservationSchema,
} from '../../schemas/reservation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hotel.name, schema: HotelSchema },
      { name: HotelRoom.name, schema: RoomSchema },
      { name: Reservation.name, schema: ReservationSchema },
    ]),
  ],
  controllers: [HotelsController, RoomsController, ReservationsController],
  providers: [HotelsService, RoomsService, ReservationsService],
})
export class HotelsModule {}
