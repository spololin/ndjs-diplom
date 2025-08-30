import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Query,
  Param,
  Put,
  UseInterceptors,
  UploadedFiles,
  HttpCode,
} from '@nestjs/common';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/guards/roles.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { destination, filename } from 'src/utils/file-upload.utils';
import { HotelRoomService } from './hotelRoom.service';
import {
  CreateRoomParams,
  SearchRoomsParams,
  UpdateRoomParams,
} from '../../interfaces/hotel';
import { Id } from '../../interfaces/common';

@Controller()
export class HotelRoomController {
  constructor(private readonly hotelRoomService: HotelRoomService) {}

  @Get('/common/hotel-rooms')
  async searchRooms(@Query() query: SearchRoomsParams) {
    const hotelRooms = await this.hotelRoomService.search(query);

    return hotelRooms.map((hotelRoom) => ({
      id: hotelRoom._id,
      description: hotelRoom.description,
      hotel: hotelRoom.hotel,
      images: hotelRoom.images,
    }));
  }

  @Get('/common/hotel-rooms/:id')
  async searchRoom(@Param() params: { id: Id }) {
    const hotelRoom = await this.hotelRoomService.findById(params.id);

    return {
      id: hotelRoom._id,
      description: hotelRoom.description,
      images: hotelRoom.images,
      isEnabled: hotelRoom.isEnabled,
      hotel: hotelRoom.hotel,
    };
  }

  @Roles('admin')
  @UseGuards(RoleGuard)
  @Post('admin/hotel-rooms/')
  @UseInterceptors(
    FilesInterceptor('images', 100, {
      storage: diskStorage({
        destination,
        filename,
      }),
    }),
  )
  async create(@Body() body: CreateRoomParams, @UploadedFiles() images) {
    const hotelRoom = await this.hotelRoomService.create({
      ...body,
      images: images && images.map((image) => image.originalname),
    });

    return {
      id: hotelRoom._id,
      description: hotelRoom.description,
      images: hotelRoom.images,
      isEnabled: hotelRoom.isEnabled,
      hotel: hotelRoom.hotel,
    };
  }

  @Roles('admin')
  @UseGuards(RoleGuard)
  @Put('admin/hotel-rooms/:id')
  @UseInterceptors(
    FilesInterceptor('images', 100, {
      storage: diskStorage({
        destination,
        filename,
      }),
    }),
  )
  @HttpCode(204)
  async update(
    @Param('id') id: Id,
    @Body() body: UpdateRoomParams,
    @UploadedFiles() files,
  ) {
    const imagesInRoom: string[] = [];
    if (body.images) {
      if (Array.isArray(body.images)) {
        imagesInRoom.push(...body.images);
      } else {
        imagesInRoom.push(body.images);
      }
    }

    await this.hotelRoomService.update(id, {
      ...body,
      images: [
        ...imagesInRoom,
        ...(files ? files.map((image) => image.filename) : []),
      ],
    });
  }
}
