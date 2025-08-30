import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import {
  CreateReservationParams,
  ReservationDto,
  ReservationSearchOptions,
} from '../../interfaces/reservation';
import { Id } from '../../interfaces/common';
import { RoleGuard } from '../../guards/role.guard';
import { Roles } from '../../guards/roles.decorator';
import { User } from '../../decorators/user.decorator';

@Controller()
export class ReservationController {
  constructor(private readonly ReservationsService: ReservationService) {}

  @Roles('client')
  @UseGuards(RoleGuard)
  @Post('client/reservations')
  async createReservation(@Body() body: CreateReservationParams, @User() user) {
    const data: ReservationDto = {
      userId: user._id,
      roomId: body.hotelRoom,
      dateEnd: body.endDate,
      dateStart: body.startDate,
    };
    const reservation = await this.ReservationsService.addReservation(data);

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

  @Roles('client')
  @UseGuards(RoleGuard)
  @Get('client/reservations')
  async get(
    @Query() params: { dateStart?: Date; dateEnd?: Date },
    @User() user,
  ) {
    const data: ReservationSearchOptions = {
      userId: user._id,
      dateEnd: params.dateStart,
      dateStart: params.dateStart,
    };

    const reservations = await this.ReservationsService.getReservations(data);

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

  @Roles('client')
  @UseGuards(RoleGuard)
  @Delete('client/reservations/:id')
  @HttpCode(204)
  async deleteReservation(@Param('id') id: Id) {
    await this.ReservationsService.removeReservation(id);
  }

  @Roles('manager')
  @UseGuards(RoleGuard)
  @Get('manager/reservations/:userId')
  async getManager(@Param('userId') id: Id) {
    const reservations = await this.ReservationsService.getReservations({
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

  @Roles('manager')
  @UseGuards(RoleGuard)
  @Delete('manager/reservations/:id')
  @HttpCode(204)
  async deleteManager(@Param('id') id: Id) {
    await this.ReservationsService.removeReservation(id);
  }
}
