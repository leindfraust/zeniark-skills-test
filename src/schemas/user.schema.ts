import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ id: true })
export class User {
  @Prop({
    required: true,
    unique: true,
  })
  username: string;

  @Prop()
  name: string;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({ default: 'user' })
  role: string;

  @Prop({ required: true })
  provider: string;

  @Prop({ required: true })
  providerId: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
