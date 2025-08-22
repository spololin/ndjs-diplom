import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Hotel } from './hotel.schema';

@Schema()
export class HotelRoom {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true })
  public hotel: Hotel;

  @Prop()
  public description: string;

  @Prop({ default: [] })
  public images: string[];

  @Prop({ required: true })
  public createdAt: Date;

  @Prop({ required: true })
  public updatedAt: Date;

  @Prop({ required: true, default: true })
  public isEnabled: boolean;
}

export type RoomDocument = HotelRoom & Document;
export const RoomSchema = SchemaFactory.createForClass(HotelRoom);
