import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  IReservation,
  ReservationDto,
  ReservationSearchOptions,
} from '../../interfaces/reservation';
import { Id } from '../../interfaces/common';
import { Reservation } from 'src/schemas/reservation.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HotelRoomService } from '../hotelRoom/hotelRoom.service';
import { UserService } from '../users/user.service';

@Injectable()
export class ReservationService implements IReservation {
  constructor(
    @InjectModel(Reservation.name)
    private readonly ReservationModel: Model<Reservation>,
    private readonly RoomService: HotelRoomService,
    private readonly UsersService: UserService,
  ) {}

  async addReservation(data: ReservationDto): Promise<Reservation> {
    const room = await this.RoomService.findById(data.roomId);
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const user = await this.UsersService.findById(data.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!room.isEnabled) {
      throw new BadRequestException('Room is not available');
    }

    const reservation = new this.ReservationModel({
      userId: data.userId,
      roomId: data.roomId,
      hotelId: room.hotel._id,
      dateStart: data.dateStart,
      dateEnd: data.dateEnd,
    });
    await (await reservation.save()).populate(['roomId', 'hotelId']);

    return reservation;
  }

  async removeReservation(id: Id): Promise<void> {
    const reservation = await this.ReservationModel.findById(id);

    if (!reservation) {
      throw new BadRequestException('Reservation not found');
    }

    await this.ReservationModel.findByIdAndDelete(id);
  }

  async getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Array<Reservation>> {
    const query = {
      user: filter.userId,
      dateStart: filter.dateStart,
      dateEnd: filter.dateEnd,
    };

    return await this.ReservationModel.find(query)
      .populate(['room', 'hotel'])
      .exec();
  }
}
