import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import * as reservations from '../../interfaces/reservations';
import * as commonTypes from '../../common/types';

@Controller()
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post('client/reservations')
  async createReservation(@Body() body: reservations.CreateReservationParams) {
    const data: reservations.ReservationDto = {
      userId: '123',
      roomId: body.hotelRoom,
      dateEnd: body.endDate,
      dateStart: body.startDate,
    };
    const reservation = await this.reservationsService.addReservation(data);

    return {
      startDate: reservation.dateStart,
      endDate: reservation.dateEnd,
      hotelRoom: {
        description: reservation.roomId.description,
        images: reservation.roomId.images,
      },
      hotel: {
        title: reservation.hotelId.title,
        description: reservation.hotelId.description,
      },
    };
  }

  @Get('client/reservations')
  async get(@Query() params: { dateStart?: Date; dateEnd?: Date }) {
    const data: reservations.ReservationSearchOptions = {
      userId: '123',
      dateEnd: params.dateStart,
      dateStart: params.dateStart,
    };

    const reservations = await this.reservationsService.getReservations(data);

    return reservations.map((reservation) => ({
      startDate: reservation.dateStart,
      endDate: reservation.dateEnd,
      hotelRoom: {
        description: reservation.roomId.description,
        images: reservation.roomId.images,
      },
      hotel: {
        title: reservation.hotelId.title,
        description: reservation.hotelId.description,
      },
    }));
  }

  @Delete('client/reservations/:id')
  @HttpCode(204)
  async deleteReservation(@Param('id') id: commonTypes.ID) {
    await this.reservationsService.removeReservation(id);
  }

  @Get('manager/reservations/:userId')
  async getManager(@Param('userId') id: commonTypes.ID) {
    const reservations = await this.reservationsService.getReservations({
      userId: id,
    });

    return reservations.map((reservation) => ({
      startDate: reservation.dateStart,
      endDate: reservation.dateEnd,
      hotelRoom: {
        description: reservation.roomId.description,
        images: reservation.roomId.images,
      },
      hotel: {
        title: reservation.hotelId.title,
        description: reservation.hotelId.description,
      },
    }));
  }

  @Delete('manager/reservations/:id')
  @HttpCode(204)
  async deleteManager(@Param('id') id: commonTypes.ID) {
    await this.reservationsService.removeReservation(id);
  }
}
