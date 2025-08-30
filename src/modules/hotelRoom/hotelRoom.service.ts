import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HotelRoom, HotelRoomDocument } from 'src/schemas/hotelRoom.schema';
import {
  CreateRoomParams,
  IHotelRoomService,
  UpdateRoomParams,
  SearchRoomsParams,
} from '../../interfaces/hotel';
import { HotelService } from '../hotel/hotel.service';
import { Id } from '../../interfaces/common';

@Injectable()
export class HotelRoomService implements IHotelRoomService {
  constructor(
    @InjectModel(HotelRoom.name)
    private HotelRoomModel: Model<HotelRoomDocument>,
    private readonly HotelsService: HotelService,
  ) {}

  public async create(data: CreateRoomParams): Promise<HotelRoom> {
    const hotel = await this.HotelsService.findById(data.hotelId);

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    const hotelData = {
      hotel: data.hotelId,
      title: data.title,
      description: data.description,
      createdAt: new Date(),
      updatedAt: new Date(),
      images: data.images,
    };

    const room = new this.HotelRoomModel(hotelData);
    await (await room.save()).populate('hotel');

    return room;
  }

  public async findById(id: Id): Promise<HotelRoom> {
    const room = await this.HotelRoomModel.findById(id).populate('hotel');

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }

  public async search(data: SearchRoomsParams): Promise<HotelRoom[]> {
    const hotel = await this.HotelsService.findById(data.hotel);

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    return await this.HotelRoomModel.find({
      hotel: data.hotel,
      isEnabled: data.isEnabled,
    })
      .skip(data.offset)
      .limit(data.limit)
      .exec();
  }

  public async update(id: Id, data: UpdateRoomParams): Promise<HotelRoom> {
    const hotel = await this.HotelsService.findById(data.hotelId);

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    const room = await this.HotelRoomModel.findByIdAndUpdate(
      id,
      {
        ...data,
        updatedAt: new Date(),
      },
      {
        new: true,
      },
    ).populate('hotel');

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }
}
