import { Id } from '../common';
import { Reservation } from '../../schemas/reservation.schema';

export interface ReservationDto {
  userId: Id;
  roomId: Id;
  dateStart: Date;
  dateEnd: Date;
}

export interface ReservationSearchOptions {
  userId: Id;
  dateStart?: Date;
  dateEnd?: Date;
}

export interface IReservation {
  addReservation(data: ReservationDto): Promise<Reservation>;
  removeReservation(id: Id): Promise<void>;
  getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Array<Reservation>>;
}

export interface CreateReservationParams {
  hotelRoom: Id;
  startDate: Date;
  endDate: Date;
}
