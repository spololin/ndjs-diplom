import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Hotel, HotelDocument } from '../../schemas/hotel.schema';
import {
  IHotelService,
  SearchHotelParams,
  UpdateHotelParams,
} from '../../interfaces/hotels';
import { ID } from 'src/common/types';

@Injectable()
export class HotelsService implements IHotelService {
  constructor(
    @InjectModel(Hotel.name)
    private HotelModel: Model<HotelDocument>,
  ) {}

  async findById(id: ID): Promise<Hotel> {
    const hotel = await this.HotelModel.findById(id);
    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    return hotel;
  }

  async search(params: SearchHotelParams): Promise<HotelDocument[]> {
    const { offset, limit, title } = params;

    return await this.HotelModel.find({ title })
      .skip(offset)
      .limit(limit)
      .exec();
  }

  async update(id: ID, params: UpdateHotelParams): Promise<HotelDocument> {
    const hotel = await this.HotelModel.findByIdAndUpdate(id, params, {
      new: true,
    }).exec();

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    return hotel;
  }

  public async create(body: UpdateHotelParams) {
    const hotelData = {
      title: body.title,
      description: body.description,
      createdAt: new Date(),
      updatedAt: new Date(),
      files: [],
    };

    const hotel = new this.HotelModel(hotelData);
    await hotel.save();

    return hotel;
  }
}
