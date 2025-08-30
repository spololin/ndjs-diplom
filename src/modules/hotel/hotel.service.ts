import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hotel, HotelDocument } from 'src/schemas/hotel.schema';
import {
  IHotelService,
  SearchHotelParams,
  UpdateHotelParams,
} from '../../interfaces/hotel';
import { Id } from '../../interfaces/common';

@Injectable()
export class HotelService implements IHotelService {
  constructor(
    @InjectModel(Hotel.name)
    private HotelModel: Model<HotelDocument>,
  ) {}

  public async create(data: UpdateHotelParams): Promise<Hotel> {
    const hotel = new this.HotelModel({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await hotel.save();
  }

  public async findById(id: Id): Promise<Hotel> {
    const hotel = this.HotelModel.findById(id).exec();

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    return hotel;
  }

  public async search(params: SearchHotelParams): Promise<Hotel[]> {
    const query: { title?: RegExp } = {};

    if (params.title) query.title = new RegExp(params.title, 'i');

    return await this.HotelModel.find(query)
      .skip(params.offset)
      .limit(params.limit)
      .exec();
  }

  public async update(id: Id, data: UpdateHotelParams): Promise<Hotel> {
    const hotel = await this.HotelModel.findByIdAndUpdate(id, data, {
      new: true,
    }).exec();

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    return hotel;
  }
}
