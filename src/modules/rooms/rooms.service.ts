import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateRoomParams,
  HotelRoomService,
  SearchRoomsParams,
  UpdateRoomParams,
} from '../../interfaces/hotels';
import { ID } from 'src/common/types';
import { HotelRoom, RoomDocument } from 'src/schemas/rooms.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HotelsService } from '../hotels/hotels.service';

@Injectable()
export class RoomsService implements HotelRoomService {
  constructor(
    @InjectModel(HotelRoom.name)
    private readonly RoomModel: Model<RoomDocument>,
    private readonly hotelsService: HotelsService,
  ) {}

  async create(body: CreateRoomParams): Promise<HotelRoom> {
    const hotel = await this.hotelsService.findById(body.hotelId);

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    const hotelData = {
      hotel: body.hotelId,
      title: body.title,
      description: body.description,
      createdAt: new Date(),
      updatedAt: new Date(),
      images: [],
    };

    const room = new this.RoomModel(hotelData);
    await (await room.save()).populate('hotel');

    return room;
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
    const query = {
      hotel,
      isEnabled,
    };

    return await this.RoomModel.find(query).skip(offset).limit(limit).exec();
  }

  async update(id: ID, body: UpdateRoomParams): Promise<RoomDocument> {
    if (body.hotelId) {
      const hotel = await this.hotelsService.findById(body.hotelId);

      if (!hotel) {
        throw new NotFoundException('Hotel not found');
      }
    }

    const room = await this.RoomModel.findByIdAndUpdate(id, body, {
      new: true,
    }).populate('hotel');

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }
}
