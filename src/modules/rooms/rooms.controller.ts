import { Controller, Get, Param, Query } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomDocument } from '../../schemas/rooms.schema';
import * as hotels from '../../interfaces/hotels';
import * as commonTypes from '../../common/types';
import { SearchRoomDto } from '../../interfaces/hotels';

@Controller('common/hotel-rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  public findAll(
    @Query() params: hotels.SearchRoomsParams,
  ): Promise<RoomDocument[]> {
    return this.roomsService.search(params);
  }

  @Get(':id')
  async getById(@Param('id') id: commonTypes.ID) {
    const room = await this.roomsService.findById(id);
    const roomData = room.toObject({ getters: true }) as SearchRoomDto;

    return {
      id: roomData.id,
      description: roomData.description,
      images: roomData.images,
      hotel: {
        id: roomData.hotel.id,
        title: roomData.hotel.title,
        description: roomData.hotel.description,
      },
    };
  }
}
