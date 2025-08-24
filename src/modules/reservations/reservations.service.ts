import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  IReservation,
  ReservationDto,
  ReservationSearchOptions,
} from '../../interfaces/reservations';
import { ID } from 'src/common/types';
import {
  Reservation,
  ReservationDocument,
} from 'src/schemas/reservation.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RoomsService } from '../rooms/rooms.service';

@Injectable()
export class ReservationsService implements IReservation {
  constructor(
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<Reservation>,
    private readonly roomService: RoomsService,
  ) {}

  async addReservation(data: ReservationDto): Promise<ReservationDocument> {
    const room = await this.roomService.findById(data.roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (!room.isEnabled) {
      throw new BadRequestException('Room is not available');
    }

    const reservation = new this.reservationModel({
      user: data.userId,
      room: data.roomId,
      hotel: room.hotel._id,
      dateStart: data.dateStart,
      dateEnd: data.dateEnd,
    });
    await (await reservation.save()).populate(['room', 'hotel']);

    return reservation;
  }

  async removeReservation(id: ID): Promise<void> {
    const reservation = await this.reservationModel.findById(id);

    if (!reservation) {
      throw new BadRequestException('Reservation not found');
    }

    await this.reservationModel.findByIdAndDelete(id);
  }

  async getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Array<Reservation>> {
    const query = {
      user: filter.userId,
      dateStart: filter.dateStart,
      dateEnd: filter.dateEnd,
    };
    return await this.reservationModel
      .find(query)
      .populate(['room', 'hotel'])
      .exec();
  }
}
