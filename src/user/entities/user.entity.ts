import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Role } from 'src/role/entities/role.entity';

@Schema({timestamps:true})
export class User extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  refreshToken?: string;

  @Prop()
  image?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role',required:false})
  role_id: Role;

}

export const UserSchema = SchemaFactory.createForClass(User);
