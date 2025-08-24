import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
  ParseFilePipeBuilder,
  Put,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomDocument } from '../../schemas/rooms.schema';
import * as hotels from '../../interfaces/hotels';
import * as commonTypes from '../../common/types';
import * as hotelsParams from '../../interfaces/hotels';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller()
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get('common/hotel-rooms')
  async find(
    @Query() params: hotels.SearchRoomsParams,
  ): Promise<RoomDocument[]> {
    return await this.roomsService.search(params);
  }

  @Get('common/hotel-rooms/:id')
  async getById(@Param('id') id: commonTypes.ID) {
    const room = await this.roomsService.findById(id);

    return {
      id: room._id,
      description: room.description,
      images: room.images,
      hotel: {
        id: room.hotel._id,
        title: room.hotel.title,
        description: room.hotel.description,
      },
    };
  }

  @Post('admin/hotel-rooms')
  @UseInterceptors(FilesInterceptor('images', undefined))
  async create(
    @Body() body: hotelsParams.CreateRoomParams,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image',
        })
        .build(),
    )
    images: Express.Multer.File[],
  ) {
    const room = (await this.roomsService.create({
      ...body,
      images: images.map((image) => image.filename),
    })) as unknown as RoomDocument;

    return {
      id: room._id,
      description: room.description,
      images: room.images,
      hotel: {
        id: room.hotel._id,
        title: room.hotel.title,
        description: room.hotel.description,
      },
    };
  }

  @Put('admin/hotel-rooms/:id')
  @UseInterceptors(FilesInterceptor('images', undefined))
  async update(
    @Body() body: hotelsParams.UpdateRoomParams,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image',
        })
        .build(),
    )
    images: Express.Multer.File[],
  ) {
    const imagesInRoom: string[] = [];
    if (body.images) {
      if (Array.isArray(body.images)) {
        imagesInRoom.push(...body.images);
      } else {
        imagesInRoom.push(body.images);
      }
    }
    const room = (await this.roomsService.update(body.hotelId, {
      ...body,
      images: [...imagesInRoom, ...images.map((image) => image.filename)],
    })) as unknown as RoomDocument;

    return {
      id: room._id,
      description: room.description,
      images: room.images,
      hotel: {
        id: room.hotel._id,
        title: room.hotel.title,
        description: room.hotel.description,
      },
    };
  }
}
