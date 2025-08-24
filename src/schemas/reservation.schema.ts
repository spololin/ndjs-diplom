import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import * as hotelSchema from './hotel.schema';
import * as userSchema from './user.schema';
import { HotelRoom } from './rooms.schema';

@Schema()
export class Reservation {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  public userId: userSchema.UserDocument;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' })
  public hotelId: hotelSchema.HotelDocument;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HotelRoom',
  })
  public roomId: HotelRoom;

  @Prop({ required: true })
  public dateStart: Date;

  @Prop({ required: true })
  public dateEnd: Date;
}

export type ReservationDocument = Reservation & Document;
export const ReservationSchema = SchemaFactory.createForClass(Reservation);
