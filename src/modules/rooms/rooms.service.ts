import { Injectable } from '@nestjs/common';
import { HotelRoomService, SearchRoomsParams } from '../../interfaces/hotels';
import { ID } from 'src/common/types';
import { HotelRoom, RoomDocument } from 'src/schemas/rooms.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RoomsService implements HotelRoomService {
  constructor(
    @InjectModel(HotelRoom.name) private RoomModel: Model<RoomDocument>,
  ) {}
  create(data: Partial<HotelRoom>): Promise<HotelRoom> {
    throw new Error('Method not implemented.');
  }
  async findById(id: ID): Promise<RoomDocument> {
    const room = await this.RoomModel.findById(id).populate('hotel');

    if (!room) {
      throw new Error('Room not found');
    }

    return room;
  }
  async search(params: SearchRoomsParams): Promise<RoomDocument[]> {
    const { offset, limit, hotel, isEnabled } = params;
    console.log(offset, limit, hotel, isEnabled);
    const query = {
      hotel,
      isEnabled,
    };

    return await this.RoomModel.find(query).skip(offset).limit(limit).exec();
  }
  update(id: ID, data: Partial<HotelRoom>): Promise<HotelRoom> {
    throw new Error('Method not implemented.');
  }
}
