import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from './user.schema';
import { Message } from './message.schema';

@Schema()
export class SupportRequest {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  public userId: User;

  @Prop({ required: true })
  public createdAt: Date;

  @Prop({ default: [] })
  public messages: Message[];

  @Prop()
  public isActive: boolean;
}

export type SupportRequestDocument = SupportRequest & Document;
export const SupportRequestSchema =
  SchemaFactory.createForClass(SupportRequest);
