import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Hotel } from './hotel.schema';

@Schema()
export class HotelRoom {
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' })
  public hotel: Hotel;

  @Prop()
  public description: string;

  @Prop({ default: [] })
  public images: string[];

  @Prop({ required: true })
  public createdAt: Date;

  @Prop({ required: true })
  public updatedAt: Date;

  @Prop({ default: true })
  public isEnabled: boolean;
}

export type HotelRoomDocument = HotelRoom & Document;
export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom);
