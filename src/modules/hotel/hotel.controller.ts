import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Query,
  Param,
} from '@nestjs/common';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/guards/roles.decorator';
import { HotelService } from './hotel.service';
import { UpdateHotelParams, SearchHotelParams } from '../../interfaces/hotel';
import { Id } from '../../interfaces/common';

@Controller()
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Roles('admin')
  @UseGuards(RoleGuard)
  @Post('admin/hotels/')
  async create(@Body() body: UpdateHotelParams) {
    const hotel = await this.hotelService.create(body);

    return {
      id: hotel._id,
      title: hotel.title,
      description: hotel.description,
    };
  }

  @Roles('admin')
  @UseGuards(RoleGuard)
  @Get('admin/hotels/')
  async searchHotels(@Query() query: SearchHotelParams) {
    const hotels = await this.hotelService.search(query);

    return hotels.map((item) => ({
      id: item._id,
      title: item.title,
      description: item.description,
    }));
  }

  @Roles('admin')
  @UseGuards(RoleGuard)
  @Get('admin/hotels/:id')
  async searchHotel(@Param('id') id: Id) {
    const hotel = await this.hotelService.findById(id);

    return {
      id: hotel._id,
      title: hotel.title,
      description: hotel.description,
    };
  }

  @Roles('admin')
  @UseGuards(RoleGuard)
  @Get('admin/hotels/:id')
  async update(@Param('id') id: Id, @Body() body: UpdateHotelParams) {
    const hotel = await this.hotelService.update(id, body);

    return {
      id: hotel._id,
      title: hotel.title,
      description: hotel.description,
    };
  }
}
