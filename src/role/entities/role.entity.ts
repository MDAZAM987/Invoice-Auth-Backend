import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/user/entities/user.entity';

@Schema({ timestamps: true })
export class Role extends Document {
  @Prop({ required: true, unique:true })
  title: string;

  @Prop({
    type: [
      {
        permission: { type: mongoose.Schema.Types.ObjectId, ref: 'Permission' },
        allowedActions: { type: [String], default: [] },
        fieldPermissions: [
          {
            field: { type: String},
            allowedActions: { type: [String], default: [] }, 
          },
        ],
      },
    ],
    default: [],
  })
  role_permissions: {
    permission: mongoose.Schema.Types.ObjectId;
    allowedActions: string[];
    fieldPermissions: { field: string; allowedActions: string[] }[];
  }[];

  @Prop({ default: false })
  isDeleted: boolean;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  // createdBy: User;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  // updatedBy: User;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
