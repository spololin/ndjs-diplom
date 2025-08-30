import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Message } from './message.schema';
import { User } from './user.schema';

@Schema()
export class SupportRequest {
  _id: mongoose.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  public user: User;

  @Prop({ required: true })
  public createdAt: Date;

  @Prop()
  public messages: Message[];

  @Prop()
  public isActive: boolean;
}

export type SupportRequestDocument = SupportRequest & Document;
export const SupportRequestSchema =
  SchemaFactory.createForClass(SupportRequest);
