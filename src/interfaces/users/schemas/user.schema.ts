import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as commonTypes from '../../../common/types';

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  public email: string;

  @Prop({ required: true })
  public passwordHash: string;

  @Prop({ required: true })
  public name: string;

  @Prop()
  public contactPhone: string;

  @Prop({ required: true, default: 'client' })
  public role: commonTypes.Role;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
