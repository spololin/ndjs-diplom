import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import * as hotels from '../../interfaces/hotels';
import { HotelDocument } from '../../schemas/hotel.schema';
import * as commonTypes from '../../common/types';
import { UpdateHotelParams } from '../../interfaces/hotels';
import { ID } from '../../common/types';

@Controller('admin/hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Post()
  public create(
    @Body() params: hotels.UpdateHotelParams,
  ): Promise<HotelDocument> {
    return this.hotelsService.create(params);
  }

  @Get()
  public gelList(
    @Query() params: hotels.SearchHotelParams,
  ): Promise<HotelDocument[]> {
    return this.hotelsService.search(params);
  }

  @Put(':id')
  public update(
    @Param('id') id: commonTypes.ID,
    @Query() params: hotels.UpdateHotelParams,
  ) {
    const hotel = this.hotelsService.update(
      id,
      params,
    ) as unknown as HotelDocument;
    const hotelData = hotel.toObject({ getters: true }) as UpdateHotelParams & {
      id: ID;
    };

    return {
      id: hotelData.id,
      description: hotelData.description,
      title: hotelData.title,
    };
  }
}
