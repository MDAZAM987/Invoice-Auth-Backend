import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/user/entities/user.entity';

@Schema({ timestamps: true })
export class Permission extends Document {
  @Prop({ required: true,unique: true  })
  title: string; // Permission title like 'Company', 'BankAccount', etc.
  
  @Prop()
  tableKey: string; // New field to represent the table key

  @Prop({ default: false })
  isDeleted: boolean;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
  // createdBy: User;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  // updatedBy: User;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
