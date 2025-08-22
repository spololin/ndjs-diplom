import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Hotel } from './hotel.schema';
import { User } from './user.schema';
import { HotelRoom } from './rooms.schema';

@Schema()
export class Reservation {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  public userId: User;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' })
  public hotelId: Hotel;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Room' })
  public roomId: HotelRoom;

  @Prop({ required: true })
  public dateStart: Date;

  @Prop({ required: true })
  public dateEnd: Date;
}

export type ReservationDocument = Reservation & Document;
export const ReservationSchema = SchemaFactory.createForClass(Reservation);
