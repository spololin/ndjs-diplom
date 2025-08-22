import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Hotel {
  @Prop({ required: true, unique: true })
  public title: string;

  @Prop()
  public description: string;

  @Prop({ required: true })
  public createdAt: Date;

  @Prop({ required: true })
  public updatedAt: Date;
}

export type HotelDocument = Hotel & Document;
export const HotelSchema = SchemaFactory.createForClass(Hotel);
