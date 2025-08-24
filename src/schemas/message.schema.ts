import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import * as userSchema from './user.schema';

@Schema()
export class Message {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  public author: userSchema.UserDocument;

  @Prop({ required: true })
  public sentAt: Date;

  @Prop({ required: true })
  public text: string;

  @Prop()
  public readAt: Date;
}

export type MessageDocument = Message & Document;
export const MessageSchema = SchemaFactory.createForClass(Message);
