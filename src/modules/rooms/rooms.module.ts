import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelRoom, RoomSchema } from '../../schemas/rooms.schema';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
  imports: [
    MongooseModule.forFeature([{ name: HotelRoom.name, schema: RoomSchema }]),
  ],
})
export class RoomsModule {}
